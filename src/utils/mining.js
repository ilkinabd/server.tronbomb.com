const { START_MINING, START_MINING_LEVEL, MINING_LEVEL_DELTA } = process.env;

const db = require('@db');

const start = new Date(START_MINING);
const startLevel = parseFloat(START_MINING_LEVEL);
const levelDelta = parseFloat(MINING_LEVEL_DELTA);

const day = 24 * 60 * 60 * 1000;

const level = () => {
  const level = Math.ceil((new Date() - start) / day);
  const step = startLevel + (level - 1) * levelDelta;
  return { level, step };
};

const mining = async(bet, wallet) => {
  const { step } = level();

  const leftovers = (await db.users.getTRXBetSum({ wallet })) % step;
  const count = Math.floor((leftovers + bet) / step);

  console.log(leftovers, bet);
  console.log(count);
};

module.exports = {
  level,
  mining,
};
