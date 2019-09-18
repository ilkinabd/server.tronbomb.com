const { ENABLED } = JSON.parse(process.env.AUCTION);

const db = require('@db');
const node = require('@controllers/node');
const { getIndex, expectedPrize } = require('@utils/auction');

const auctionBet = async(data) => {
  const { bet, wallet } = data;
  const auctionNumber = getIndex();

  const maxBet = await db.auction.getMaxBet({ auctionNumber });
  if (bet >= maxBet + 1 && ENABLED) {
    await db.auction.add({ wallet, bet, auctionNumber });

    const bets = await db.auction.getByLimit({ auctionNumber, limit: 10 });
    const topBets = await expectedPrize(bets);

    this.chanel.emit('auction-bet', topBets);
  } else {
    const type = 'auction';
    node.fund.transferBOMB({ to: wallet, amount: bet, type });
  }
};

module.exports = (node, chanel) => {
  node.on('auction-bet', auctionBet);
  this.chanel = chanel;
};
