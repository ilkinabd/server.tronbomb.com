const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { updateLevel } = require('@utils/users');

const socket = io.connect(NODE, { reconnect: true });
let sockets;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'wheel',
    token: NODE_TOKEN,
  });
});

const start = async(data) => {
  const { gameId: index, finishBlock } = data;
  await db.wheel.add({ index, finishBlock });
  sockets.in('wheel').emit('start', { index, finishBlock });
};

const takePart = async(data) => {
  const { index, wallet, betId, bet, sector } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const gameId = await db.wheel.getId({ index });

  await db.wheelBets.add({ gameId, userId, index: betId, bet, sector });
  updateLevel(userId);

  sockets.in('wheel').emit('take-part', { index, wallet, betId, bet, sector });
};

const finish = async(data) => {
  const { gameId: index } = data;
  db.wheel.setConfirm({ index });
};

const reward = async(data) => {
  const { gameId: index, betId } = data;
  const gameId = await db.wheel.getId({ index });
  await db.wheelBets.setConfirm({ gameId, index: betId });
};

socket.on('start', start);
socket.on('take-part', takePart);
socket.on('finish', finish);
socket.on('reward', reward);

module.exports = (io) => {
  sockets = io;
};
