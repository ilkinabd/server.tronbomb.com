const { PLATFORM_BALANCE } = process.env;

const node = require('@controllers/node');

const day = 24 * 60 * 60 * 1000;

const calculateProfit = async() => {
  const { balanceTRX } = await node.tools.portalBalance();
  if (!balanceTRX) return;

  const profit = balanceTRX - PLATFORM_BALANCE;
  console.log(profit);
};

const updateTime = new Date().setUTCHours(12, 0, 0);
const now = Date.now();
const timeout = now < updateTime ? updateTime - now : updateTime + day - now;

setTimeout(() => {
  calculateProfit();
  setInterval(calculateProfit, day);
}, timeout);
