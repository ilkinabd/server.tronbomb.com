const { NODE, NODE_TOKEN, WHEEL_START_BLOCK, WHEEL_DURATION } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');

const startBlock = parseInt(WHEEL_START_BLOCK);
const gameDuration = parseInt(WHEEL_DURATION);

const socket = io.connect(NODE, { reconnect: true });
let chanel;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'wheel',
    token: NODE_TOKEN,
  });
});

const takePart = async(data) => {
  const { wallet, bet, tokenId, sector, finishBlock, index } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  await db.wheel.add({ index, finishBlock, userId, bet, tokenId, sector });

  updateLevel(wallet);
  referrerProfit(wallet, index, bet, 'wheel');

  const gameIndex = Math.floor((finishBlock - startBlock) / gameDuration) - 1;
  chanel.emit('wheel-bet', { index: gameIndex, wallet, bet, tokenId, sector });
};

const reward = async(data) => {
  const { index } = data;
  await db.wheel.setConfirm({ index });
};

socket.on('wheel-take-part', takePart);
socket.on('wheel-reward', reward);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
