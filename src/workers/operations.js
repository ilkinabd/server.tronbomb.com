const { NODE, NODE_TOKEN, WITHDRAW_FEE } = process.env;

const io = require('socket.io-client');

const db = require('@db');

const socket = io.connect(NODE, { reconnect: true });
const fee = parseFloat(WITHDRAW_FEE);

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'operations',
    token: NODE_TOKEN,
  });
});

const referralProfit = async(data) => {
  const { wallet, to, amount } = data;
  const id = await db.refWithdraws.add({ wallet, amount, to, fee });
  if (!id) return;
};

socket.on('withdraw-referral-profit', referralProfit);
