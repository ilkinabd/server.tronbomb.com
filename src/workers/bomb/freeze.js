const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const node = require('@controllers/node');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'bomb',
    token: NODE_TOKEN,
  });
});

const freeze = async(data) => {
  const { amount, finishTime, wallet, hash } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  await db.freeze.add({ hash, amount, userId, finishTime });
};

const completeFrozen = async() => {
  const activeFrozens = await db.freeze.getActives();

  for (const operation of activeFrozens) {
    const { txId, finish, amount, wallet } = operation;

    if (finish > new Date()) continue;

    await db.freeze.setComplete({ txId });

    const type = 'dividends';
    await node.fund.transferBOMB({ to: wallet, amount, type });
  }
};

setInterval(completeFrozen, 5000);

socket.on('bomb-freeze', freeze);
