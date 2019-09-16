const { START, INTERVAL } = JSON.parse(process.env.DIVIDENDS);

const db = require('@db');

const leftToPayout = () => {
  const delta = (Date.now() - START) % INTERVAL;
  const timeout = INTERVAL - delta;
  return timeout;
};

const operatingProfit = async() => {
  const diceProfit = await db.dice.getProfit({ interval: INTERVAL });
  const wheelProfit = await db.wheel.getProfit({ interval: INTERVAL });
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
