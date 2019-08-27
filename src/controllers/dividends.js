const db = require('@db');
const {
  getNextPayoutTimestamp,
  getOperatingProfit,
  getUserProfit,
} = require('@utils/dividends');
const { resSuccess } = require('@utils/res-builder');

const dividendsInfo = async(req, res) => {
  const frozenBombSum = await db.freeze.getSum();
  const { wallet } = req.query;
  const userID = db.users.getId(wallet);
  const totalBombMined = 123; //TODO: get total mined from node

  const params = {
    nextPayout: getNextPayoutTimestamp(),
    operatingProfit: getOperatingProfit(),
    userProfit: getUserProfit(userID),
    frozenBombSum,
    totalBombMined,
  };

  res.json(resSuccess(params));
};

module.exports = {
  dividendsInfo,
};
