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

const getProfit = (type, count) => {
  switch (type) {
    case 'ad': return profits[1] * count;
    case 'random-jackpot': return profits[2] * count;
    case 'bet-amount-jackpot': return profits[3] * count;
    case 'technical': return profits[4] * count;
    case 'referral-rewards': return profits[5] * count;
    case 'team': return profits[6] * count;
    case 'auction': return profits[7] * count;
    default: return null;
  }
};

const payProfit = async(count, wallet) => {
  const { funds } = await node.tools.getFunds();

  const rewards = Array.from(funds, (fund) => ({
    to: fund.address,
    amount: getProfit(fund.type, count),
    type: fund.type,
  })).filter(item => item.amount);

  rewards.push({
    to: wallet,
    amount: profits[0] * count,
  });

  for (const { to, amount, type } of rewards) {
    await node.bomb.func.transfer({ to, amount });
    if (type) node.fund.freezeAll({ type });
  }
};

const mining = async(bet, wallet) => {
  const { step } = level();

  const leftovers = (await db.users.getTRXBetSum({ wallet })) % step;
  const count = Math.floor((leftovers + bet) / step);

  if (count !== 0) payProfit(count, wallet);
};

module.exports = {
  level,
  mining,
};
