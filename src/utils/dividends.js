const { PLATFORM_BALANCE } = process.env;
const db = require('@db');

const node = require('@controllers/node');

const getNextPayoutTimestamp = () => {
  const result = new Date();
  result.setUTCHours(12, 0, 0);
  if (result > Date.now()) {
    result.setDate(new Date(result).getDate() + 1);
  }

  return result.getTime();
};

const getOperatingProfit = async() => {
  const { balanceTRX } = await node.tools.portalBalance();

  if (!balanceTRX) return;

  return balanceTRX - PLATFORM_BALANCE;
};

const getUserProfit = async(userId, operatingProfit) => {
  const frozenBombSum = await db.freeze.getSum();
  if (frozenBombSum === 0) return 0;
  const userFrozenBombs = await db.freeze.getUserSum(userId);
  const result = operatingProfit * (userFrozenBombs / frozenBombSum);
  return result;
};

module.exports = {
  getNextPayoutTimestamp,
  getOperatingProfit,
  getUserProfit,
};
