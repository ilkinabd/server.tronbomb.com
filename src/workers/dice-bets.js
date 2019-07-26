const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { dice } = require('@controllers/node');
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

const processEvent = async(data) => {
  const { index, wallet, finishBlock, bet, number, roll } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const gameId = await db.games.add({ index, finishBlock, status: 'start' });

  const params = JSON.stringify({ number, roll });
  await db.bets.add({ gameId, userId, bet, params });
  updateUserLevel(userId);

  setTimeout(() => {
    dice.functions.finishGame({ gameId: index });
  }, 2000);
};

socket.on('dice', processEvent);
