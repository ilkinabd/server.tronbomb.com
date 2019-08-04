const db = require('@db');

module.exports = (chanel) => {
  setInterval(async() => {
    const rating = await db.users.getTop({ limit: 100 });
    chanel.emit('rating', { rating });
  }, 30000);
};
