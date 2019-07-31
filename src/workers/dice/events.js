const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const utils = require('@utils/dice');
const userUtils = require('@utils/users');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'dice',
    token: NODE_TOKEN,
  });
});

const updateLevel = async(userId) => {
  const sum = await db.diceBets.getSum({ userId });
  const level = userUtils.getLevel(sum);
  db.users.setLevel({ userId, level });
};

const takePart = async(data) => {
  const { index, wallet, finishBlock, bet, number, roll: rollIndex } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const gameId = await db.dice.add({ index, finishBlock });
  const roll = utils.getRoll(rollIndex);
  if (!roll) return;

  await db.diceBets.add({ gameId, userId, bet, number, roll });
  updateLevel(userId);
};

const finish = async(data) => {
  const { gameId: index } = data;
  db.dice.setConfirm({ index });
};

// const reward = async(data) => {
//   const { gameId: index, wallet } = data;
//   const userId = await db.users.getId({ wallet });
//   const gameId = await db.games.getId({ index, contractId: 0 });

//   db.bets.setConfirm({ userId, gameId });
// };

socket.on('take-part', takePart);
socket.on('finish', finish);
// socket.on('reward', reward);
