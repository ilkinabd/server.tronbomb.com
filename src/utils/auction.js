const { START_AUCTION } = JSON.parse(process.env.AUCTION);

const currentAuctionNumber = () => {
  const day = 24 * 60 * 60 * 1000;
  const result = Math.round((new Date() - new Date(START_AUCTION)) / day);
  return result;
};

module.exports = {
  currentAuctionNumber,
};
