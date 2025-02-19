const { WITHDRAW_FEE, MIN_WITHDRAW, MIN_MINE } = process.env;

const db = require('@db');
const { fund, bomb } = require('@controllers/node');
const rollbar = require('@utils/rollbar');

const fee = parseFloat(WITHDRAW_FEE);

const referralProfit = async(data) => {
  const { wallet } = data;

  const profit = await db.users.getRefProfit({ wallet });
  if (profit < MIN_WITHDRAW) return;

  const amount = profit - fee;
  const type = 'referral-rewards';
  const payload = await fund.transfer({ to: wallet, amount, type });
  if (!payload || !payload.txID) return;

  const currentProfit = await db.users.getRefProfit({ wallet });
  rollbar.info(`referralProfit change ${-profit} \ncurrentProfit: ${currentProfit}`);
  console.log(`referralProfit change ${-profit}`);
  console.log(`currentProfit: ${currentProfit}`);

  await db.users.setRefProfit({ wallet, delta: -profit });
  db.referrals.add({ wallet, amount: -profit, type: 'withdraw' });
};

const mine = async(data) => {
  const { wallet } = data;
  const amount = await db.users.getMine({ wallet });
  if (amount < MIN_MINE) return;

  console.info(`Mine ${amount} from ${wallet}.`);
  await db.users.setMine({ wallet, delta: -amount });
  await bomb.func.transfer({ to: wallet, amount });
};

module.exports = (node) => {
  node.on('withdraw-referral-profit', referralProfit);
  node.on('mine', mine);
};
