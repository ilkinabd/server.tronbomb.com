const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const node = require('@controllers/node');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'withdraw',
    token: NODE_TOKEN,
  });
});

const withdraw = async(data) => {
  const { wallet, code } = data;

  const params = await db.refWithdraws.getByCode({ wallet, code });
  if (Object.keys(params).length === 0) return;

  const { txId, to, amount, fee } = params;
  const payload = await node.tools.withdraw({ wallet, to, amount });
  if (!payload) return;

  const delta = -(amount + fee);

  await db.refWithdraws.setComplete({ txId, hash: payload.txID });
  await db.users.setRefProfit({ wallet, delta });
};

socket.on('withdraw', withdraw);
