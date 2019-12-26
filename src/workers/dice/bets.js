const db = require('@db');

module.exports = chanel => {
  setInterval(async () => {
    const bets = await db.users.getAllBets({ limit: 25 });
    chanel.emit('bets', { bets });
  }, 5000);
};
