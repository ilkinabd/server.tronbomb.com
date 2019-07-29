const calculateReward = (params, result, amount, rtp) => {
  const { number, roll } = params;

  let reward;

  if (roll === 0 && result < number) {
    reward = amount * 77 / number;
  } else if (roll === 1 && number < result) {
    reward = amount * 77 / (77 - number);
  } else if (roll === 2 && number === result) {
    reward = amount * 77;
  } else {
    return 0;
  }

  return reward * rtp;
};

module.exports = {
  calculateReward,
};
