const { AUCTION_START } = process.env;

const currentAuctionNumber = () => {
  const day = 24 * 60 * 60 * 1000;
  const result = Math.round((new Date() - new Date(AUCTION_START)) / day);
  return result;
};

module.exports = {
  currentAuctionNumber,
};
