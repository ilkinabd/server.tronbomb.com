const { TOKENS, WHEEL_START_BLOCK, WHEEL_DURATION, DECIMAL } = process.env;

const { rng } = require('@controllers/node').wheel.func;

const tokens = TOKENS.split(',');
const startBlock = parseInt(WHEEL_START_BLOCK);
const duration = parseInt(WHEEL_DURATION);

const sectors = [
  0, 4, 0, 1, 0, 2, 1, 0, 3, 0,
  2, 0, 1, 0, 6, 0, 1, 0, 2, 1,
  0, 3, 0, 2, 0, 1, 0, 4, 0, 1,
  0, 2, 1, 0, 3, 0, 2, 0, 1, 0,
  5, 0, 1, 0, 2, 1, 0, 3, 0, 2,
  0, 1
];

const coefs = [2, 4, 6, 12, 24, 48, 48];

const getSymbol = (tokenId) => tokens[tokenId];
const getSector = (index) => sectors[index];
const getCoef = (sector) => coefs[sector];

const toDecimal = amount => Math.floor(amount * 10 ** DECIMAL) / 10 ** DECIMAL;
const getIndex = finish => Math.floor((finish - startBlock) / duration);

const getRandom = async(block) => {
  const payload = await rng({ block });
  return payload.result;
};

module.exports = {
  getSymbol,
  toDecimal,
  getIndex,
  getSector,
  getCoef,
  getRandom,
};
