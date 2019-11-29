// eslint-disable-next-line no-unused-vars
const { DELAY, INTERVAL } = JSON.parse(process.env.FREEZE);

const db = require('@db');
const { withdraw } = require('@controllers/node').portal.func;

const freeze = async(data) => {
  const { amount, wallet, hash } = data;
  if (amount === 0) return;

  const userId = await db.users.add({ wallet });
  await db.freeze.cancelAllUnfreeze({ userId });

  const type = 'freeze';
  const txId = await db.freeze.add({ type, amount, userId });
  db.freeze.setComplete({ hash, txId });
};

const unfreezeAll = async(data) => {
  const { wallet } = data;

  const userId = await db.users.add({ wallet });
  await db.freeze.cancelAllUnfreeze({ userId });
  const amount = await db.freeze.getUserSum({ wallet });
  if (amount === 0) return;

  const type = 'unfreeze';
  db.freeze.add({ type, amount: -amount, userId });
};

const unfreezeWorker = async() => {
  const operations = await db.freeze.getAwaiting();

  for (const { time, amount, wallet: to, txId } of operations) {
    if (new Date(time).getTime() + DELAY > Date.now()) continue;

    const response = await withdraw({
      to,
      amount: amount * 10e6,
      isToken: true
    });
    if (response.result) {
      await db.freeze.setComplete({ hash: response.result, txId });
    } else {
      console.error(`Can't unfreeze\nAddress: ${to}\nResponse: ${JSON.stringify(response)}`);
    }
  }
};

module.exports = (node) => {
  node.on('bomb-freeze', freeze);
  node.on('bomb-unfreeze-all', unfreezeAll);

  setInterval(unfreezeWorker, INTERVAL);
};
