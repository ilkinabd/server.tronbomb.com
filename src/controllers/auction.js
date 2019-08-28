const node = require('@controllers/node');
const { currentAuctionNumber } = require('@utils/auction');
const { successRes } = require('@utils/res-builder');

const fund = async(_req, res) => {
  const type = 'auction';
  const { balanceTRX, address } = await node.fund.balance({ type });
  const round = currentAuctionNumber();
  successRes(res, { balanceTRX, address, round });
};

module.exports = {
  fund,
};
