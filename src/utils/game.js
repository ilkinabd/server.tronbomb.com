// Added new env variable COIN_RTP
const {
  TOKENS, WHEEL_START_BLOCK, WHEEL_DURATION, DECIMAL, DICE_RTP, COIN_RTP
} = process.env;

const { rng: diceRNG } = require('@controllers/node').dice.func;
const { rng: wheelRNG } = require('@controllers/node').wheel.func;
const { rng: coinRNG } = require('@controllers/node').coin.func;


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

const diceRandom = async (address, block) =>
  (await diceRNG({ address, block })).result;

const coinRandom = async (address, block) =>
  (await coinRNG({ address, block })).result;

const wheelRandom = async block => (await wheelRNG({ block })).result;

const diceReward = (number, roll, result, bet) => {
  let reward = 0;
  switch (roll) {
    case 'under':
      if (result < number) reward = bet * 77 / (number - 1);
      break;
    case 'over':
      if (number < result) reward = bet * 77 / (77 - number);
      break;
    case 'exact':
      if (number === result) reward = bet * 77;
      break;
  }

  return toDecimal(reward * DICE_RTP);
};

const coinReward = (number, result, bet) => {
  let reward = 0;
  if (number === result) reward = bet * 2;
  return toDecimal(reward * COIN_RTP);
}

module.exports = {
  getSymbol,
  getSector,
  getCoef,
  toDecimal,
  getIndex,
  diceRandom,
  coinRandom,
  wheelRandom,
  diceReward,
  coinReward,
};
