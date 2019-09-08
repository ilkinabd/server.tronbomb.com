const { NODE, NODE_TOKEN, UNFREEZE_TIME } = process.env;

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

const unfreezeTime = parseInt(UNFREEZE_TIME);

const freeze = async(data) => {
  const { amount, wallet, hash } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  await db.freeze.cancelAllUnfreeze({ userId });

  const type = 'freeze';
  const txId = await db.freeze.add({ hash, type, amount, userId });
  await db.freeze.setComplete({ txId });
};

const unfreeze = async(data) => {
  const { amount, wallet, hash } = data;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const userFreeze = await db.freeze.getUserSum({ wallet });

  if (userFreeze < amount) return;

  const type = 'unfreeze';
  await db.freeze.add({ hash, type, amount: -amount, userId });
};

const completeFrozen = async() => {
  const operations = await db.freeze.getAwaiting();

  for (const { time, amount, wallet, txId } of operations) {
    if (new Date(time).getTime() + unfreezeTime > Date.now()) continue;

    await db.freeze.setComplete({ txId });

    const type = 'bomb-hodler';
    await node.fund.transferBOMB({ to: wallet, amount, type });
  }
};

setInterval(completeFrozen, 5000);

socket.on('bomb-freeze', freeze);
socket.on('bomb-unfreeze', unfreeze);
