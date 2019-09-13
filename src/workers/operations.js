const { WITHDRAW_FEE, MIN_WITHDRAW, MAX_WITHDRAW, MIN_MINE } = process.env;

const db = require('@db');
const { fund, bomb } = require('@controllers/node');

const fee = parseFloat(WITHDRAW_FEE);

const referralProfit = async(data) => {
  const { wallet } = data;

  const profit = await db.users.getRefProfit({ wallet });
  if (profit < MIN_WITHDRAW || MAX_WITHDRAW < profit) return;

  const amount = profit - fee;
  const type = 'referral-rewards';
  const payload = await fund.transfer({ to: wallet, amount, type });
  if (!payload || !payload.txID) return;

  await db.users.setRefProfit({ wallet, delta: -profit });
  db.referrals.addWithdraw({ wallet, amount: -profit });
};

const mine = async(data) => {
  const { wallet } = data;
  const sum = await db.mining.getUserSum({ wallet });
  if (sum < MIN_MINE) return;

  await db.mining.add({ type: 'withdraw', wallet, amount: -sum });
  await bomb.func.transfer({ to: wallet, amount: sum });
};

module.exports = (node) => {
  node.on('withdraw-referral-profit', referralProfit);
  node.on('mine', mine);
};
