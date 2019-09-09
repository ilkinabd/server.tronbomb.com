const { START_DIVIDENDS, DIVIDENDS_INTERVAL } = process.env;

const db = require('@db');

const start = new Date(START_DIVIDENDS);
const interval = DIVIDENDS_INTERVAL;

const leftToPayout = () => {
  const delta = (Date.now() - start) % interval;
  const timeout = interval - delta;
  return timeout;
};

const operatingProfit = async() => {
  const diceProfit = await db.dice.getProfit({ interval });
  const wheelProfit = await db.wheel.getProfit({ interval });
  return diceProfit + wheelProfit;
};

const userProfit = async(wallet, operatingProfit) => {
  const frozenBombSum = await db.freeze.getSum();
  if (frozenBombSum === 0) return 0;
  const userFrozenBombs = await db.freeze.getUserSum({ wallet });
  const result = operatingProfit * (userFrozenBombs / frozenBombSum);
  return result;
};

module.exports = {
  leftToPayout,
  operatingProfit,
  userProfit,
};
