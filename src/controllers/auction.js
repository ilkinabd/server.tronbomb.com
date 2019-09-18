const node = require('@controllers/node');
const { getIndex } = require('@utils/auction');
const { successRes } = require('@utils/res-builder');

const fund = async(_req, res) => {
  const type = 'auction';
  const { balanceTRX, address } = await node.fund.balance({ type });
  const round = getIndex();
  successRes(res, { balanceTRX, address, round });
};

module.exports = {
  fund,
};
