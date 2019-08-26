const {
  NODE, NODE_TOKEN, WITHDRAW_FEE, MIN_WITHDRAW, MAX_WITHDRAW
} = process.env;

const io = require('socket.io-client');

const db = require('@db');
const node = require('@controllers/node');

const socket = io.connect(NODE, { reconnect: true });
const fee = parseFloat(WITHDRAW_FEE);

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'operations',
    token: NODE_TOKEN,
  });
});

const withdrawReferralProfit = async(wallet, to, amount, txId) => {
  if (amount < MIN_WITHDRAW || MAX_WITHDRAW < amount) return;

  const profit = await db.users.getRefProfit({ wallet });
  const delta = amount + fee;

  if (profit < delta) return;

  const type = 'dividends';
  const payload = await node.fund.transfer({ to, amount, type });
  if (!payload || !payload.txID) return;

  await db.refWithdraws.setComplete({ txId, hash: payload.txID });
  await db.users.setRefProfit({ wallet, delta: -delta });
};

const referralProfit = async(data) => {
  const { wallet, to, amount } = data;
  const txId = await db.refWithdraws.add({ wallet, amount, to, fee });
  if (!txId) return;

  withdrawReferralProfit(wallet, to, amount, txId);
};

socket.on('withdraw-referral-profit', referralProfit);
