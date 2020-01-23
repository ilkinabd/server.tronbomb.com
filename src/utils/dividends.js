const { DECIMAL, DIVIDENDS } = process.env;
const { START, INTERVAL } = JSON.parse(DIVIDENDS);

const db = require('@db');

const delay = 60 * 1000;

const round = amount => Math.floor(amount * 10 ** DECIMAL) / 10 ** DECIMAL;

const leftToPayout = () => {
  const delta = (Date.now() - new Date(START)) % INTERVAL;
  const timeout = INTERVAL - delta;
  return timeout;
};

const operatingProfit = async () => {
  const interval = (Date.now() - delay - new Date(START)) % INTERVAL;
  const diceProfit = await db.dice.getProfit({ interval });
  const wheelProfit = await db.wheel.getProfit({ interval });
  const coinProfit = await db.coin.getProfit({ interval });
  const betsProfit = await db.bets.getProfit({ interval });
  const minusProfit = await db.operationProfit.getMinus();
  return diceProfit + wheelProfit + coinProfit + betsProfit + minusProfit;
};

const userProfit = async (wallet, operatingProfit) => {
  const frozenBombSum = await db.freeze.getSum();
  if (frozenBombSum === 0) return 0;
  const userFrozenBombs = await db.freeze.getUserSum({ wallet });
  const result = operatingProfit * (userFrozenBombs / frozenBombSum);
  return result;
};

module.exports = {
  round,
  leftToPayout,
  operatingProfit,
  userProfit,
};
