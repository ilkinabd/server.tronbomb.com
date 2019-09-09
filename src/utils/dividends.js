const { START_DIVIDENDS, DIVIDENDS_INTERVAL } = process.env;

const db = require('@db');
const node = require('@controllers/node');

const start = new Date(START_DIVIDENDS);

const leftToPayout = () => {
  const delta = (Date.now() - start) % DIVIDENDS_INTERVAL;
  const timeout = DIVIDENDS_INTERVAL - delta;
  return timeout;
};

// TODO: remove it
const day = 24 * 60 * 60 * 1000;

// TODO: remove it
const nextPayoutTimeout = () => {
  const result = new Date().setUTCHours(12, 0, 0) - Date.now();
  return (result > 0) ? result : result + day;
};

const operatingProfit = async() => {
  const { balanceTRX } = await node.tools.portalBalance();
  if (!balanceTRX) return 0;

  const previousBalance = await db.operationProfit.getLastBalance();
  const profit = balanceTRX - previousBalance;
  return { balance: balanceTRX, profit };
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
  nextPayoutTimeout,
  operatingProfit,
  userProfit,
};
