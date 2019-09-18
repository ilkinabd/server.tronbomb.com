const { DECIMAL, AUCTION } = process.env;
const { START, MAX_FUND, PRIZES, INTERVAL } = JSON.parse(AUCTION);

const node = require('@controllers/node');

const round = amount => Math.floor(amount * 10 ** DECIMAL) / 10 ** DECIMAL;
const getIndex = () => Math.round((new Date() - new Date(START)) / INTERVAL);

const addExpected = async(bets) => {
  const type = 'auction';
  const { balanceTRX } = await node.fund.balance({ type });
  const pool = Math.min(balanceTRX, MAX_FUND);

  for (let i = 0; i < 10; i++) {
    if (!bets[i]) break;
    bets[i].expected = round(PRIZES[i] * pool);
  }

  return bets;
};

module.exports = {
  getIndex,
  addExpected,
};
