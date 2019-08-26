const { START_MINING, START_MINING_LEVEL, MINING_LEVEL_DELTA } = process.env;

const start = new Date(START_MINING);
const startLevel = parseFloat(START_MINING_LEVEL);
const levelDelta = parseFloat(MINING_LEVEL_DELTA);

const day = 24 * 60 * 60 * 1000;

const level = () => {
  const level = Math.ceil((new Date() - start) / day);
  const step = startLevel + (level - 1) * levelDelta;
  return { level, step };
};

module.exports = {
  level,
};
