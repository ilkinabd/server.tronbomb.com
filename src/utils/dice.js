const { DICE_RTP, TOKENS } = process.env;

const { rng } = require('@controllers/node').dice.func;

const tokens = TOKENS.split(',');

const getSymbol = (tokenId) => tokens[tokenId];

const getRandom = async(address, block) => {
  const payload = await rng({ address, block });
  return payload.result;
};

const getReward = (number, roll, result, bet) => {
  switch (roll) {
    case 'under':
      if (result < number) return (bet * 77 / number) * DICE_RTP;
      break;
    case 'over':
      if (number < result) return (bet * 77 / (77 - number)) * DICE_RTP;
      break;
    case 'exact':
      if (number === result) return (bet * 77) * DICE_RTP;
      break;
  }
  return 0;
};

module.exports = {
  getSymbol,
  getRandom,
  getReward,
};
