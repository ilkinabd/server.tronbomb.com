const db = require('@db');
const { dice } = require('@controllers/node');

const lastTimestamp = (events, from) => {
  let last = from;

  for (const bet of events) {
    const { timestamp } = bet;
    last = Math.max(last, timestamp);
  }
  return last + 1;
};

const processEvents = async(events, io) => {
  for (const data of events) {
    const { result, gameId: index } = data.result;
    await db.games.setFinish({ index, contractId: 0, result });

    const game = await db.bets.getByIndex({ index });
    io.in('dice').emit('dice', { games: [game] });
  }
};

module.exports = async(io) => {
  let from = 0;

  setInterval(async() => {
    const data = await dice.events.finishGames({ from });
    const { events } = data;

    from = lastTimestamp(events, from);
    processEvents(events, io);
  }, 1000);
};
