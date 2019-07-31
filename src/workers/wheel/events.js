const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
// const utils = require('@utils/users');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'wheel',
    token: NODE_TOKEN,
  });
});

// const updateUserLevel = async(userId) => {
//   const betsSum = await db.bets.getSum({ userId });
//   const level = utils.getLevel(betsSum);
//   db.users.setLevel({ userId, level });
// };

const start = async(data) => {
  const { gameId: index, finishBlock } = data;
  await db.wheel.add({ index, finishBlock });
};

// const takePart = async(data) => {
//   const { index, wallet, finishBlock, bet, betId, sector } = data;

//   let userId = await db.users.getId({ wallet });
//   if (!userId) userId = await db.users.add({ wallet });

//   const gameId = await db.games.add({ index, finishBlock, contractId: 0 });

//   const params = JSON.stringify({ sector });
//   await db.bets.add({ gameId, userId, bet, params, index: betId });
//   updateUserLevel(userId);
// };

socket.on('start', start);
// socket.on('take-part', takePart);
