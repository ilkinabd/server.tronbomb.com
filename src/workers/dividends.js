const {
  MIN_OPERATION_PROFIT, DIVIDENDS_INTERVAL, FUND_DELAY,
  TRONWEB_DELAY, JACKPOT_DELAY, JACKPOTS_ACTIVE,
} = process.env;

const db = require('@db');
const { leftToPayout, operatingProfit } = require('@utils/dividends');
const { finishAuction } = require('@workers/auction/finish');
const { bomb, portal, fund, tools } = require('@controllers/node');
const randomJackpot = require('@workers/jackpots/random');

const timeout = leftToPayout();

const withdraw = async(data) => {
  const { wallet } = data;
  const amount = await db.dividends.getUserSum({ wallet });
  if (amount < 10) return;

  const type = 'withdraw';
  await db.dividends.add({ wallet, amount: -amount, type });

  const params = { to: wallet, amount };
  const result = await portal.func.withdraw(params);
  console.info('Withdraw dividends:', wallet, result);
};

const payFundsRewards = async() => {
  const { funds } = await tools.getFunds();
  for (const { address } of funds) withdraw({ wallet: address });
};

const payRewards = async(profit) => {
  const usersAmounts = await db.freeze.getUsersAmounts();
  const totalFreeze = await db.freeze.getSum();

  for (const { wallet, amount } of usersAmounts) {
    const sum = profit * (amount / totalFreeze);
    const type = 'deposit';
    if (sum > 0) await db.dividends.add({ wallet, amount: sum, type });
  }

  payFundsRewards();
};

const freezeFunds = async() => {
  const { funds } = await tools.getFunds();

  for (const { address: wallet, type } of funds) {
    const sum = await db.users.getMine({ wallet });
    if (sum <= 0) continue;

    await db.users.setMine({ wallet, delta: -sum });
    await bomb.func.transfer({ to: wallet, amount: sum });

    setTimeout(() => { fund.freezeAll({ type }); }, TRONWEB_DELAY);
  }
};

const calculateProfit = async() => {
  const profit = await operatingProfit();
  await db.operationProfit.add({ profit });

  const noCompleteProfit = await db.operationProfit.getNoComplete();
  if (noCompleteProfit > MIN_OPERATION_PROFIT) {
    await finishAuction(this.io.in('auction'));
    payRewards(noCompleteProfit);

    await db.operationProfit.setCompleteAll();
  }

  setTimeout(freezeFunds, DIVIDENDS_INTERVAL - FUND_DELAY);

  if (JACKPOTS_ACTIVE === 'true') setTimeout(() => {
    randomJackpot(this.io.in('jackpots'));
  }, JACKPOT_DELAY);
};

setTimeout(freezeFunds, timeout - FUND_DELAY);

setTimeout(() => {
  setInterval(calculateProfit, DIVIDENDS_INTERVAL);
  calculateProfit();
}, timeout);

module.exports = (node, io) => {
  node.on('withdraw-dividends', withdraw);
  this.io = io;
};
