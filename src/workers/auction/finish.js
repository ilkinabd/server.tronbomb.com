const db = require('@db');
const { AUCTION } = process.env;

const giveRewards = async() => {
  const constants = JSON.parse(AUCTION);
  const aucNumber = 1; //todo: get current auc number here
  const winnerBets = await db.auction
    .getAllBets({ aucNumber, limit: constants.WINNERS_COUNT });

  const aucFund = 10000; //todo: get auc fund here

  for (let i = 0; i < winnerBets.length; i++) {
    const item = winnerBets[i];
    const prize = aucFund * constants['PAYOUT_COEFS'][i];

    await db.auction.setPrize({ id: item.auction_id, prize });
  }
};

module.exports = {
  giveRewards,
};
