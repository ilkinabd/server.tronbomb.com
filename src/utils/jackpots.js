const { MAX_FUND } = JSON.parse(process.env.JACKPOTS);

const { fund } = require('@controllers/node');

const getFund = async(type) => {
  const { balanceTRX } = await fund.balance({ type });
  return Math.min(balanceTRX, MAX_FUND);
};

module.exports = {
  getFund,
};
