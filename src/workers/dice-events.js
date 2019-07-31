const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const utils = require('@utils/users');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'dice',
    token: NODE_TOKEN,
  });
});

const updateUserLevel = async(userId) => {
  const betsSum = await db.bets.getSum({ userId });
  const level = utils.getLevel(betsSum);
  db.users.setLevel({ userId, level });
};

const takePart = async(data) => {
  const { index, wallet, finishBlock, bet, number, roll } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const gameId = await db.games.add({ index, finishBlock, contractId: 0 });

  const params = JSON.stringify({ number, roll });
  await db.bets.add({ gameId, userId, bet, params });
  updateUserLevel(userId);
};

const finish = async(data) => {
  const { gameId: index } = data;
  db.games.setConfirm({ index });
};

const reward = async(data) => {
  const { gameId: index, wallet } = data;
  const userId = await db.users.getId({ wallet });
  const gameId = await db.games.getId({ index, contractId: 0 });

  db.bets.setConfirm({ userId, gameId });
};

socket.on('take-part', takePart);
socket.on('finish', finish);
socket.on('reward', reward);
