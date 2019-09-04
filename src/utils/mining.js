const {
  START_MINING, START_MINING_LEVEL, MINING_LEVEL_DELTA, MINING_PROFIT
} = process.env;

const db = require('@db');
const node = require('@controllers/node');

const start = new Date(START_MINING);
const startLevel = parseFloat(START_MINING_LEVEL);
const levelDelta = parseFloat(MINING_LEVEL_DELTA);

const profits = Array.from(MINING_PROFIT.split(','), parseFloat);

const day = 24 * 60 * 60 * 1000;

const level = () => {
  const level = Math.ceil((new Date() - start) / day);
  const step = startLevel + (level - 1) * levelDelta;
  return { level, step };
};

const getProfit = (type, amount) => {
  switch (type) {
    case 'ad':                 return profits[1] * amount;
    case 'random-jackpot':     return profits[2] * amount;
    case 'bet-amount-jackpot': return profits[3] * amount;
    case 'technical':          return profits[4] * amount;
    case 'referral-rewards':   return profits[5] * amount;
    case 'team':               return profits[6] * amount;
    case 'auction':            return profits[7] * amount;
    default: return 0;
  }
};

const fundsProfit = async(playerProfit) => {
  const { funds } = await node.tools.getFunds();

  for (const { address: wallet, type } of funds) {
    const amount = getProfit(type, playerProfit);
    if (amount === 0) continue;

    await db.mining.add({ type: 'mine', wallet, amount });
  }
};

const mining = async(bet, wallet) => {
  const { step } = level();
  const amount = bet / step;
  await db.mining.add({ type: 'mine', wallet, amount });

  fundsProfit(amount);
};

module.exports = {
  level,
  mining,
};
