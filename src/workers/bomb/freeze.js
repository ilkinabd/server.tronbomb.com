const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'bomb',
    token: NODE_TOKEN,
  });
});

const burn = async(data) => {
  const { amount, finishTime, wallet, hash } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  await db.freeze.add({ hash, amount, userId, finishTime });
};

socket.on('bomb-freeze', burn);
