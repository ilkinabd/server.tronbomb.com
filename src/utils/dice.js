const getRoll = (index) => {
  switch (index) {
    case 0: return 'under';
    case 1: return 'over';
    case 2: return 'extra';
  }
};

const getReward = (params, result, amount, rtp) => {
  const { number, roll } = params;

  switch (roll) {
    case 'under':
      if (result < number) return (amount * 77 / number) * rtp; break;
    case 'over':
      if (number < result) return (amount * 77 / (77 - number)) * rtp; break;
    case 'extra':
      if (number === result) return (amount * 77) * rtp; break;
  }
  return 0;
};

module.exports = {
  getRoll,
  getReward,
};
