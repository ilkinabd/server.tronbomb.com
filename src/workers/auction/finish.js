const db = require('@db');
const { transfer, transferBOMB } = require('@controllers/node').fund;
const { getIndex, addExpected } = require('@utils/auction');

const zeroAddress = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';
const type = 'auction';

const payRewards = (bets) => {
  let burnFund = 0;

  for (const { auctionId, wallet, bet, expected } of bets) {
    db.auction.setPrize({ auctionId, prize: expected });
    transfer({ to: wallet, amount: expected, type });
    burnFund += bet;
  }

  transferBOMB({ to: zeroAddress, amount: burnFund, type });
};

const sendBackBomb = (bets) => {
  for (const { wallet, bet } of bets)
    transferBOMB({ to: wallet, amount: bet, type });
};

module.exports = async(chanel) => {
  const index = getIndex();
  const payload = await db.auction.getAll({ index });
  const bets = await addExpected(payload);

  const topBets = bets.slice(0, 10);
  const loseBets = bets.slice(10);

  chanel.emit('auction-finish', { topBets });

  payRewards(topBets);
  sendBackBomb(loseBets);

  db.auction.finishAll();
};
