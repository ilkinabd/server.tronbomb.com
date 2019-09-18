const db = require('@db');
const node = require('@controllers/node');
const { getIndex, expectedPrize } = require('@utils/auction');

const payRewards = async(topBets) => {
  let burnFund = 0;
  const type = 'auction';

  for (const { auctionId, wallet, bet, expected } of topBets) {
    node.fund.transfer({ to: wallet, amount: expected, type });
    db.auction.setPrize({ auctionId, prize: expected });
    burnFund += bet;
  }

  const zeroAddress = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';
  node.fund.transferBOMB({ to: zeroAddress, amount: burnFund, type });
};

const sendBackBomb = async(loseBets) => {
  for (const { auctionId, wallet, bet } of loseBets) {
    const type = 'auction';
    node.fund.transferBOMB({ to: wallet, amount: bet, type });
    db.auction.setPrize({ auctionId, prize: 0 });
  }
};

const finishAuction = async(chanel) => {
  const auctionNumber = getIndex();
  const payload = await db.auction.getAll({ auctionNumber });
  const bets = await expectedPrize(payload);

  const topBets = bets.slice(0, 10);
  const loseBets = bets.slice(10);

  chanel.emit('auction-finish', { topBets });

  await payRewards(topBets);
  await sendBackBomb(loseBets);
};

module.exports = {
  finishAuction,
};
