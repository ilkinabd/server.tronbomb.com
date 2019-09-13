const { REFERRER_PROFIT } = process.env;

const db = require('@db');
const { toDecimal } = require('@utils/game');

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

const referrerProfit = async(wallet, bet) => {
  const referrer = await db.users.getReferrer({ wallet });
  if (!referrer) return;

  const amount = toDecimal(bet * REFERRER_PROFIT);
  const type = 'income';
  db.users.setRefProfit({ wallet: referrer, delta: amount });
  db.referrals.add({ wallet, type, referrer, amount });
};

module.exports = {
  getLevel,
  updateLevel,
  referrerProfit,
};
