const { LIFE } = process.env;
const { START, INTERVAL, START_LEVEL, DELTA } = JSON.parse(LIFE);
const day = 24 * 60 * 60 * 1000;
const start = new Date(START);
const startLevel = parseFloat(START_LEVEL);
const delta = parseFloat(DELTA);


const leftToPayout = () => {
  const delta = (Date.now() - new Date(START)) % INTERVAL;
  const timeout = INTERVAL - delta;
  return timeout;
};

const level = () => {
  const level = Math.ceil((new Date() - start) / day);
  const step = startLevel + (level - 1) * delta;
  return { level, step };
};

module.exports = {
  leftToPayout,
  level,
};
