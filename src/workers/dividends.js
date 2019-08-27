const { getOperatingProfit } = require('@utils/dividends');
const node = require('@controllers/node');
const db = require('@db');

const day = 24 * 60 * 60 * 1000;

const calculateProfit = async() => {
  const profit = getOperatingProfit();

  const usersAmounts = db.freeze.getUsersAmounts();
  const totalFreeze = db.freeze.getSum();

  for (const item of usersAmounts) {
    const { wallet, amount } = item;
    const dividend = profit * (amount / totalFreeze);

    const params = { type: 'dividends', to: wallet, amount: dividend };
    await node.fund.transfer(params);
  }
};

const updateTime = new Date().setUTCHours(12, 0, 0);
const now = Date.now();
const timeout = now < updateTime ? updateTime - now : updateTime + day - now;

setTimeout(() => {
  calculateProfit();
  setInterval(calculateProfit, day);
}, timeout);
