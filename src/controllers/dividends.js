const db = require('@db');
const node = require('@controllers/node');
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
  const { totalMined } = await node.tools.totalMined();
  const operatingProfit = await getOperatingProfit();

  const params = {
    nextPayout: getNextPayoutTimestamp(),
    userProfit: await getUserProfit(userID, operatingProfit),
    operatingProfit,
    frozenBombSum,
    totalMined,
  };

  res.json(resSuccess(params));
};

module.exports = {
  dividendsInfo,
};
