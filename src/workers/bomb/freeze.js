const { UNFREEZE_DELAY } = process.env;

const db = require('@db');
const { transferBOMB } = require('@controllers/node').fund;

const delay = parseInt(UNFREEZE_DELAY);

const freeze = async(data) => {
  const { amount, wallet, hash } = data;

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

  const type = 'unfreeze';
  db.freeze.add({ type, amount: -amount, userId });
};

const unfreezeWorker = async() => {
  const operations = await db.freeze.getAwaiting();

  for (const { time, amount, wallet: to, txId } of operations) {
    if (new Date(time).getTime() + delay > Date.now()) continue;

    const type = 'stack-hodler';
    const hash = (await transferBOMB({ to, amount, type })).result;
    await db.freeze.setComplete({ hash, txId });
  }
};

setInterval(unfreezeWorker, 5000);

module.exports = (node) => {
  node.on('bomb-freeze', freeze);
  node.on('bomb-unfreeze-all', unfreezeAll);
}
