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

const calculateProfit = async(count, wallet) => {
  const { funds } = await node.tools.getFunds();
  if (!funds) return;

  for (const i in funds) {
    switch (funds[i].type) {
      case 'ad':
        funds[i].profit = profits[1] * count;
        break;
      case 'random jackpot':
        funds[i].profit = profits[2] * count;
        break;
      case 'bet amount jackpot':
        funds[i].profit = profits[3] * count;
        break;
      case 'technical':
        funds[i].profit = profits[4] * count;
        break;
      case 'referral rewards':
        funds[i].profit = profits[5] * count;
        break;
      case 'team':
        funds[i].profit = profits[6] * count;
        break;
      case 'auction':
        funds[i].profit = profits[7] * count;
        break;
    }
  }

  const rewards = funds.filter(item => item.profit);

  rewards.push({
    address: wallet,
    type: 'player',
    profit: profits[0] * count,
  });

  console.log(rewards);
};

const mining = async(bet, wallet) => {
  const { step } = level();

  const leftovers = (await db.users.getTRXBetSum({ wallet })) % step;
  const count = Math.floor((leftovers + bet) / step);

  if (count !== 0) calculateProfit(count, wallet);
};

module.exports = {
  level,
  mining,
};
