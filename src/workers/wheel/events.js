const { NODE, NODE_TOKEN, REFERRER_PROFIT } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { updateLevel } = require('@utils/users');

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

const start = async(data) => {
  const { index, finishBlock } = data;
  await db.wheel.add({ index, finishBlock });
  chanel.emit('start', { index, finishBlock });
};

const takePart = async(data) => {
  const { index, wallet, betId, bet, tokenId, sector } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const gameId = await db.wheel.getId({ index });

  await db.wheelBets.add({ gameId, userId, index: betId, bet, sector });
  updateLevel(userId);
  referrerProfit(wallet, index, bet);

  chanel.emit('take-part', { index, wallet, betId, bet, tokenId, sector });
};

const finish = async(data) => {
  const { index } = data;
  db.wheel.setConfirm({ index });
};

const reward = async(data) => {
  const { index, betId } = data;
  const gameId = await db.wheel.getId({ index });
  await db.wheelBets.setConfirm({ gameId, index: betId });
};

socket.on('wheel-start', start);
socket.on('wheel-take-part', takePart);
socket.on('wheel-finish', finish);
socket.on('wheel-reward', reward);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
