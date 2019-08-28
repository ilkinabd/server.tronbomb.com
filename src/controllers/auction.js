const node = require('@controllers/node');
const { successRes } = require('@utils/res-builder');

const fund = async(_req, res) => {
  const type = 'auction';
  const { balanceTRX } = await node.fund.balance({ type });
  successRes(res, { balanceTRX });
};

module.exports = {
  fund,
};
