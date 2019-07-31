const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { wheel } = require('@controllers/node');

const socket = io.connect(NODE, { reconnect: true });
let sockets;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'blocks',
    token: NODE_TOKEN,
  });
});

const checkStopBet = async(number) => {
  const finishBlock = number + 2;
  const index = await db.wheel.getIndexByBlock({ finishBlock });
  if (index) sockets.in('wheel').emit('stop-bets', { index });
};

const processBlocks = async(data) => {
  const { number, hash } = data;
  checkStopBet(number);
};

socket.on('blocks', processBlocks);

// Init new game
setTimeout(() => {
  wheel.functions.init();
}, 1000);

module.exports = (io) => {
  sockets = io;
};
