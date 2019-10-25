const { ACTIVE: DIVIDENDS_ACTIVE } = JSON.parse(process.env.DIVIDENDS);

const db = require('@db');
const { tools } = require('@controllers/node');
const { leftToPayout, operatingProfit } = require('@utils/dividends');

module.exports = (chanel) => {
  setInterval(async() => {
    chanel.emit('statistics', {
      active: DIVIDENDS_ACTIVE,
      nextPayout: Date.now() + leftToPayout(),
      profit: await operatingProfit(),
      totalFrozen: await db.freeze.getSum(),
      totalMined: (await tools.totalMined()).totalMined,
    });
  }, 5000);
};
