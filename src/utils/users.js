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

const updateLevel = async(userId) => {
  const diceSum = await db.diceBets.getSum({ userId });
  const wheelSum = await db.wheelBets.getSum({ userId });
  const level = getLevel(diceSum + wheelSum);
  db.users.setLevel({ userId, level });
};

module.exports = {
  getLevel,
  updateLevel,
};
