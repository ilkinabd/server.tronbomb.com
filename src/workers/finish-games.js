const db = require('@db');
const node = require('@utils/node');

const lastTimestamp = (events, from) => {
  let last = from;

  for (const bet of events) {
    const { timestamp } = bet;
    last = Math.max(last, timestamp);
  }
  return last + 1;
};

const processEvents = async(events, contractId, io) => {
  for (const data of events) {
    const { result, gameId: index } = data.result;
    await db.games.setFinish({ index, contractId, result });

    const game = await db.bets.getByIndex({ index });
    io.in('dice').emit('dice', { games: [game] });
  }
};

module.exports = async(io) => {
  const games = await db.gamesContracts.getAll();

  for (const game of games) {
    const { contractId } = game;
    let from = 0;

    setInterval(async() => {
      const data = await node.events.finishGames({ contractId, from });
      const { events } = data;

      from = lastTimestamp(events, from);
      processEvents(events, contractId, io);
    }, 1000);
  }
};
