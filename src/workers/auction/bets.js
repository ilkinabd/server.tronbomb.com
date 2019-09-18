const { BET_STEP } = JSON.parse(process.env.AUCTION);

const db = require('@db');
const node = require('@controllers/node');
const { getIndex, addExpected } = require('@utils/auction');

const auctionBet = async(data) => {
  const { bet, wallet } = data;
  const index = getIndex();

  const maxBet = await db.auction.getMaxBet({ index });
  if (bet >= maxBet + BET_STEP) {
    await db.auction.add({ wallet, bet, index });

    const bets = await db.auction.getByLimit({ index, limit: 10 });
    const topBets = await addExpected(bets);

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
