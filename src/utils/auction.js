const {
  START, FUND_LIMIT, PAYOUT_COEFS, INTERVAL
} = JSON.parse(process.env.AUCTION);

const node = require('@controllers/node');

const getIndex = () => Math.round((new Date() - new Date(START)) / INTERVAL);

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
  getIndex,
  expectedPrize,
};
