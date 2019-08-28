const {
  START_AUCTION, FUND_LIMIT, PAYOUT_COEFS
} = JSON.parse(process.env.AUCTION);

const node = require('@controllers/node');

const currentAuctionNumber = () => {
  const day = 24 * 60 * 60 * 1000;
  const result = Math.round((new Date() - new Date(START_AUCTION)) / day);
  return result;
};

const expectedPrize = async(bets) => {
  const type = 'auction';
  const { balanceTRX } = await node.fund.balance({ type });

  const pool = Math.min(balanceTRX, FUND_LIMIT);

  for (let i = 0; i < 10; i++) {
    if (!bets[i]) break;
    bets[i].expected = PAYOUT_COEFS[i] * pool;
  }

  return bets;
};

module.exports = {
  currentAuctionNumber,
  expectedPrize,
};
