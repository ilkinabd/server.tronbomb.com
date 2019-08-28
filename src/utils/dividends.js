const { PLATFORM_BALANCE } = process.env;

const db = require('@db');
const node = require('@controllers/node');

const day = 24 * 60 * 60 * 1000;

const nextPayoutTimeout = () => {
  const result = new Date().setUTCHours(12, 0, 0) - Date.now();
  return (result > 0) ? result : result + day;
};

const operatingProfit = async() => {
  const { balanceTRX } = await node.tools.portalBalance();
  if (!balanceTRX) return;
  return balanceTRX - PLATFORM_BALANCE;
};

const userProfit = async(userId, operatingProfit) => {
  const frozenBombSum = await db.freeze.getSum();
  if (frozenBombSum === 0) return 0;
  const userFrozenBombs = await db.freeze.getUserSum(userId);
  const result = operatingProfit * (userFrozenBombs / frozenBombSum);
  return result;
};

module.exports = {
  nextPayoutTimeout,
  operatingProfit,
  userProfit,
};
