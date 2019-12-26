const db = require("@db");

module.exports = chanel => {
  setInterval(async () => {
    const games = await db.dice.getByLimit({ limit: 25 });
    chanel.emit("dice", { games });
  }, 5000);
};
