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

const processEvents = async(events) => {
  for (const data of events) {
    const { amount: prize, gameId: index, player: wallet } = data.result;

    const gameId = await db.games.getId({ contractId: 0, index });
    const userId = await db.users.getId({ wallet });

    db.bets.setPrize({ gameId, userId, prize });
  }
};

(async() => {
  let from = 0;

  setInterval(async() => {
    const data = await dice.events.playersWin({ from });
    const { events } = data;

    from = lastTimestamp(events, from);
    processEvents(events);
  }, 250);
})();
