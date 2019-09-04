const { MIN_OPERATION_PROFIT, FUND_DELAY, TRONWEB_DELAY } = process.env;

const { nextPayoutTimeout, operatingProfit } = require('@utils/dividends');
const { bomb, portal, fund, tools } = require('@controllers/node');
const db = require('@db');
const { finishAuction } = require('@workers/auction/finish');

const day = 24 * 60 * 60 * 1000;
const timeout = nextPayoutTimeout();
let chanel;

const checkFund = (fund) => {
  const funds = [
    'ad', 'random-jackpot', 'bet-amount-jackpot',
    'technical', 'referral-rewards', 'team', 'auction'
  ];
  return funds.includes(fund);
};

const fillPortal = async(profit) => {
  const amount = -profit;

  const { address } = await portal.get.params();

  const params = { type: 'reserve', to: address, amount };
  await fund.transfer(params);
};

const payRewards = async(profit) => {
  await db.operationProfit.setCompleteAll();

  const usersAmounts = await db.freeze.getUsersAmounts();
  const totalFreeze = await db.freeze.getSum();

  for (const { wallet, amount } of usersAmounts) {
    const dividend = profit * (amount / totalFreeze);

    const params = { to: wallet, amount: dividend };

    const result = await portal.func.withdraw(params);
    if (result.status === 'success')
      await db.dividends.add({ wallet, amount: dividend });
  }
};

const calculateProfit = async() => {
  const amount = await operatingProfit();

  await db.operationProfit.add({ amount });

  if (amount < 0) return await fillPortal(amount);

  const noCompleteProfit = await db.operationProfit.getNoComplete();
  if (noCompleteProfit > MIN_OPERATION_PROFIT) {
    await finishAuction(chanel);
    payRewards(noCompleteProfit);
  }
};

const withdrawFunds = async() => {
  const { funds } = await tools.getFunds();

  for (const { address: wallet, type } of funds) {
    if (!checkFund(type)) continue;

    const sum = await db.mining.getUserSum({ wallet });
    if (sum < 0) continue;

    await db.mining.add({ type: 'withdraw', wallet, amount: -sum });
    await bomb.func.transfer({ to: wallet, amount: sum });

    setTimeout(() => { fund.freezeAll({ type }); }, TRONWEB_DELAY);
  }
};

setTimeout(withdrawFunds, timeout - FUND_DELAY);

setTimeout(() => {
  calculateProfit();
  setInterval(calculateProfit, day);
}, timeout);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
