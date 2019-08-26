const { NODE, NODE_TOKEN, WHEEL_START_BLOCK, WHEEL_DURATION } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');
const { mining } = require('@utils/mining');

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

  if (tokenId === 0) await mining(bet, wallet);

  const params = { index, finishBlock, userId, bet, tokenId, sector };
  const time = await db.wheel.add(params);
  const symbol = await db.tokens.getSymbol({ tokenId });

  updateLevel(wallet);
  referrerProfit(wallet, index, bet, 'wheel');

  const game = Math.floor((finishBlock - startBlock) / gameDuration) - 1;
  chanel.emit('wheel-bet', { index: game, wallet, bet, symbol, sector, time });
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
