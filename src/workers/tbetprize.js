const db = require('@db');

module.exports = chanel => {
  setInterval(async () => {
    const diceBetCount = await db.dice.getBetCount();
    const dicePrizeSum = await db.dice.getPrizeSum();
    const coinBetCount = await db.coin.getBetCount();
    const coinPrizeSum = await db.coin.getPrizeSum();
    const slotsBetCount = await db.bets.getBetCount();
    const slotsPrizeSum = await db.bets.getPrizeSum();
    const wheelBetCount = await db.wheel.getBetCount();
    const wheelPrizeSum = await db.wheel.getPrizeSum();

    const betSum = diceBetCount + wheelBetCount + coinBetCount + slotsBetCount;
    const prizeSum =
      dicePrizeSum + wheelPrizeSum + coinPrizeSum + slotsPrizeSum;
    const data = {
      betSum: betSum,
      prizeSum: prizeSum,
    };
    socket.emit('tbetprize', { data });
  }, 30000);
};
