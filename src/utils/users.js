const profits = JSON.parse(process.env.REFERRER_PROFIT);

const db = require('@db');
const { toDecimal } = require('@utils/game');
const base64 = require('base-64');
const utf8 = require('utf8');
const rollbar = require('@utils/rollbar');

const getLevel = betsSum => {
  const point = 265;
  const coef = 1.12600317;

  for (let level = 1; level < 99; level++) {
    if (betsSum < point * coef ** (level - 1)) {
      return level;
    }
  }
  return 99;
};

const updateLevel = async wallet => {
  const sum = await db.users.getBetSum({ wallet });
  const level = getLevel(sum);
  db.users.setLevel({ wallet, level });
};


const referrerProfit = async(wallet, bet) => {
  const referrers = await db.users.getReferrers({ wallet });

  for (const i in referrers) {
    if (!referrers[i]) continue;
    //this is strange, toDecimal make round 2, but we need round 3 here
    const amount = toDecimal(bet * profits[i] * 10) / 10;

    rollbar.info(`referralProfit change ${amount}`);
    console.log(`referralProfit change ${amount}`);

    db.users.setRefProfit({ wallet: referrers[i], delta: amount });
    db.referrals.add({
      wallet: referrers[i],
      referral: wallet,
      amount,
      betAmount: bet
    });
  }
};

const getUserFromToken = token => {
  const bytes = base64.decode(token);
  const json = utf8.decode(bytes);
  const profile = JSON.parse(json);
  const user = {
    index: profile.id,
    name: `${profile['first_name']} ${profile['last_name']}`
  };

  return user;
};

module.exports = {
  getLevel,
  updateLevel,
  referrerProfit,
  getUserFromToken
};
