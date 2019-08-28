const node = require('@controllers/node');
const { successRes } = require('@utils/res-builder');

const fund = async(_req, res) => {
  const type = 'auction';
  const { balanceTRX, address } = await node.fund.balance({ type });
  successRes(res, { balanceTRX, address });
};

module.exports = {
  fund,
};
