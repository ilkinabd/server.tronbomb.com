const { START, START_LEVEL, DELTA, PROFIT } = JSON.parse(process.env.MINING);

const db = require('@db');
const { getFunds } = require('@controllers/node').tools;

const start = new Date(START);
const startLevel = parseFloat(START_LEVEL);
const delta = parseFloat(DELTA);

const day = 24 * 60 * 60 * 1000;

const level = () => {
  const level = Math.ceil((new Date() - start) / day);
  const step = startLevel + (level - 1) * delta;
  return { level, step };
};

const fundsProfit = async(playerProfit) => {
  const { funds } = await getFunds();

  for (const { address: wallet, type } of funds) {
    const amount = playerProfit * (PROFIT[type] || 0);
    if (amount === 0) continue;
    db.users.setMine({ wallet, delta: amount });
  }
};

const mining = async(bet, wallet) => {
  const amount = bet / (level()).step;
  await db.users.setMine({ wallet, delta: amount });
  fundsProfit(amount);
};

module.exports = {
  level,
  mining,
};
