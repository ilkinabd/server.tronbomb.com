const db = require('@db');
const node = require('@controllers/node');
const {
  nextPayoutTimeout, operatingProfit, userProfit
} = require('@utils/dividends');
const { successRes } = require('@utils/res-builder');

const info = async(req, res) => {
  const { wallet } = req.query;

  const profit = await operatingProfit();

  const params = {
    nextPayout: Date.now() + nextPayoutTimeout(),
    userProfit: await userProfit(wallet, profit),
    operatingProfit: profit,
    frozenBombSum: await db.freeze.getSum(),
    totalMined: (await node.tools.totalMined()).totalMined,
  };

  successRes(res, params);
};

module.exports = {
  info,
};
