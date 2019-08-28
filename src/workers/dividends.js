const { MIN_OPERATION_PROFIT } = process.env;

const { nextPayoutTimeout, operatingProfit } = require('@utils/dividends');
const node = require('@controllers/node');
const db = require('@db');

const day = 24 * 60 * 60 * 1000;
const timeout = nextPayoutTimeout();

const fillPortal = async(profit) => {
  const amount = -profit;

  const { address } = await node.portal.get.params();

  const params = { type: 'reserve', to: address, amount };
  await node.fund.transfer(params);
};

const payRewards = async(profit) => {
  await db.operationProfit.setCompleteAll();

  const usersAmounts = await db.freeze.getUsersAmounts();
  const totalFreeze = await db.freeze.getSum();

  console.log(usersAmounts);
  for (const { wallet, amount } of usersAmounts) {
    const dividend = profit * (amount / totalFreeze);

    const params = { to: wallet, amount: dividend };

    console.log(params);
    const result = await node.portal.func.withdraw(params);
    if (result.status === 'success')
      await db.dividends.add({ wallet, amount: dividend });
  }
};

const calculateProfit = async() => {
  const amount = await operatingProfit();

  await db.operationProfit.add({ amount });

  if (amount < 0) return await fillPortal(amount);

  const noCompleteProfit = await db.operationProfit.getNoComplete();
  if (noCompleteProfit > MIN_OPERATION_PROFIT) payRewards(noCompleteProfit);
};

setTimeout(() => {
  calculateProfit();
  setInterval(calculateProfit, day);
}, timeout);
