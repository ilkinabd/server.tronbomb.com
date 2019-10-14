const db = require('@db');

module.exports = (chanel) => {
  setInterval(async() => {
    const rating = await db.users.getTop24({ limit: 100 });
    chanel.emit('rating24', { rating });
  }, 30000);
};
