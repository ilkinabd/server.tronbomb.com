const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'wheel',
    token: NODE_TOKEN,
  });
});

const start = async(data) => {
  const { gameId: index, finishBlock } = data;
  await db.games.add({ index, finishBlock, contractId: 1 });
};

socket.on('start', start);
