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
  const { amount, from, hash } = data;
  await db.burn.add({ amount, from, hash });
};

socket.on('bomb-burn', burn);
