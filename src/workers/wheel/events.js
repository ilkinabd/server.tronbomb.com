const {
  NODE, NODE_TOKEN, REFERRER_PROFIT, START_BLOCK, GAME_DURATION
} = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { updateLevel } = require('@utils/users');

const startBlock = parseInt(START_BLOCK);
const gameDuration = parseInt(GAME_DURATION);

const socket = io.connect(NODE, { reconnect: true });
let chanel;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'wheel',
    token: NODE_TOKEN,
  });
});

const referrerProfit = async(wallet, index, bet) => {
  const referrer = await db.users.getReferrer({ wallet });
  if (!referrer) return;

  const profit = bet * REFERRER_PROFIT;
  db.users.addRefProfit({ wallet, profit });
  db.refPayments.add({ referrer, gameType: 'wheel', index, wallet, profit });
};

const takePart = async(data) => {
  const { wallet, bet, tokenId, sector, finishBlock, index } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  await db.wheel.add({ index, finishBlock, userId, bet, sector });

  updateLevel(wallet);
  referrerProfit(wallet, index, bet);

  const gameIndex = Math.floor((finishBlock - startBlock) / gameDuration) - 1;
  chanel.emit('take-part', { index: gameIndex, wallet, bet, tokenId, sector });
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
