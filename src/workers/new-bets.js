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

const processEvents = (events) => {
  for (const bet of events) {
    console.log(bet);
  }
};

(async() => {
  const games = await db.gamesContracts.getAll();

  for (const game of games) {
    const { contractId } = game;
    let from = 0;

    setInterval(async() => {
      const data = await node.events.takeBets({ contractId, from });
      const { events } = data;

      from = lastTimestamp(events, from);
      processEvents(events);
    }, 5000);
  }
})();
