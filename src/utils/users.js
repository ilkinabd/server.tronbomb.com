const { REFERRER_PROFIT } = process.env;

const db = require('@db');

const getLevel = (betsSum) => {
  const point = 265;
  const coef = 1.12600317;

  for (let level = 1; level < 99; level++) {
    if (betsSum < point * (coef ** (level - 1))) {
      return level;
    }
  }
  return 99;
};

const updateLevel = async(wallet) => {
  const sum = await db.users.getBetSum({ wallet });
  const level = getLevel(sum);
  db.users.setLevel({ wallet, level });
};

const referrerProfit = async(wallet, index, bet, gameType) => {
  const referrer = await db.users.getReferrer({ wallet });
  if (!referrer) return;

  const profit = bet * REFERRER_PROFIT;
  db.users.setRefProfit({ wallet, delta: profit });
  db.refPayments.add({ referrer, gameType, index, wallet, profit });
};

module.exports = {
  getLevel,
  updateLevel,
  referrerProfit,
};
