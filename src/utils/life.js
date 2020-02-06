const { LIFE } = process.env;
const { START, INTERVAL, START_LEVEL, DELTA } = JSON.parse(LIFE);
const day = 24 * 60 * 60 * 1000;

const leftToPayout = () => {
  const delta = (Date.now() - new Date(START)) % INTERVAL;
  const timeout = INTERVAL - delta;
  return timeout;
};

const level = () => {
  const level = Math.ceil((new Date() - new Date(START)) / day);
  const step = parseFloat(START_LEVEL) + (level - 1) * parseFloat(DELTA);
  return { level, step };
};

module.exports = {
  leftToPayout,
  level,
};
