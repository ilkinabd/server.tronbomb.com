const profits = JSON.parse(process.env.REFERRER_PROFIT);

const db = require("@db");
const { toDecimal } = require("@utils/game");
const base64 = require("base-64");
const utf8 = require("utf8");

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
    const amount = toDecimal(bet * profits[i]);

    db.users.setRefProfit({ wallet: referrers[i], delta: amount });
    db.referrals.add({ wallet: referrers[i], referral: wallet, amount });
  }
};

const getUserFromToken = token => {
  let bytes = base64.decode(token);
  let json = utf8.decode(bytes);
  let profile = JSON.parse(json);
  let user =  {
    index: profile.id,
    name: `${profile["first_name"]} ${profile["last_name"]}`
  };

  return user;
};

module.exports = {
  getLevel,
  updateLevel,
  referrerProfit,
  getUserFromToken
};
