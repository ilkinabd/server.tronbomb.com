const getReward = (params, result, amount, rtp) => {
  const { number, roll } = params;

  switch (roll) {
    case 'under':
      if (result < number) return (amount * 77 / number) * rtp;
      break;
    case 'over':
      if (number < result) return (amount * 77 / (77 - number)) * rtp;
      break;
    case 'exact':
      if (number === result) return (amount * 77) * rtp;
      break;
  }
  return 0;
};

module.exports = {
  getReward,
};
