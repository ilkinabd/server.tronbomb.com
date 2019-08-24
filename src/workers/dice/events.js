const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'dice',
    token: NODE_TOKEN,
  });
});

const takePart = async(data) => {
  const { index, wallet, finishBlock, bet, tokenId, number, roll } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  await db.dice.add({ index, finishBlock, userId, bet, tokenId, number, roll });

  updateLevel(wallet);
  referrerProfit(wallet, index, bet, 'dice');
};

const reward = async(data) => {
  const { index } = data;
  db.dice.setConfirm({ index });
};

socket.on('dice-take-part', takePart);
socket.on('dice-reward', reward);
