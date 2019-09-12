const { DICE_RTP, TOKENS, DECIMAL } = process.env;

const { rng } = require('@controllers/node').dice.func;

const tokens = TOKENS.split(',');

const getSymbol = (tokenId) => tokens[tokenId];
const toDecimal = amount => Math.floor(amount * 10 ** DECIMAL) / 10 ** DECIMAL;

const getRandom = async(address, block) => {
  const payload = await rng({ address, block });
  return payload.result;
};

const getReward = (number, roll, result, bet) => {
  let reward = 0;
  switch (roll) {
    case 'under':
      if (result < number) reward = (bet * 77 / number) * DICE_RTP;
      break;
    case 'over':
      if (number < result) reward = (bet * 77 / (77 - number)) * DICE_RTP;
      break;
    case 'exact':
      if (number === result) reward = (bet * 77) * DICE_RTP;
      break;
  }

  return toDecimal(reward);
};

module.exports = {
  getSymbol,
  getRandom,
  getReward,
};
