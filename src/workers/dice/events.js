const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { updateLevel } = require('@utils/users');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'dice',
    token: NODE_TOKEN,
  });
});

const takePart = async(data) => {
  const { index, wallet, finishBlock, bet, number, roll } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const gameId = await db.dice.add({ index, finishBlock });

  await db.diceBets.add({ gameId, userId, bet, number, roll });
  updateLevel(userId);
};

const finish = async(data) => {
  const { gameId: index } = data;
  db.dice.setConfirm({ index });
};

const reward = async(data) => {
  const { gameId: index } = data;
  const gameId = await db.dice.getId({ index });
  db.diceBets.setConfirm({ gameId });
};

socket.on('take-part', takePart);
socket.on('finish', finish);
socket.on('reward', reward);
