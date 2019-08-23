const db = require('@db');
const { resSuccess } = require('@utils/res-builder');

const getCurrentBet = async(req, res) => {
  const currentAuctionId = 1; //todo: get current auction id
  const maxBet = await db.auction.getMaxBet({ id: currentAuctionId });
  res.json(resSuccess({ maxBet }));
};

module.exports = {
  getCurrentBet,
};
