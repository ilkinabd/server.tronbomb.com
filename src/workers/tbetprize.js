const db = require('@db');

module.exports = (chanel) => {
  setInterval(async() => {
    const diceBetCount = await db.dice.getBetCount();
    const dicePrizeSum = await db.dice.getPrizeSum();
    const wheelBetCount = await db.wheel.getBetCount();
    const wheelPrizeSum = await db.wheel.getPrizeSum();
  
    const betSum = diceBetCount + wheelBetCount;
    const prizeSum = dicePrizeSum + wheelPrizeSum; 
    const data = {
      betSum: betSum,
      prizeSum:prizeSum
    }
    chanel.emit('tbetprize', { data });
  }, 30000);
};
