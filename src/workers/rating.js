const db = require('@db');

module.exports = (io) => {
  setInterval(async() => {
    const rating = await db.users.getTop({ limit: 100 });
    io.in('rating').emit('rating', { rating });
  }, 30000);
};
