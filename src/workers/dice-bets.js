const db = require('@db');
const { dice } = require('@controllers/node');
const utils = require('@utils/users');

const lastTimestamp = (events, from) => {
  let last = from;

  for (const bet of events) {
    const { timestamp } = bet;
    last = Math.max(last, timestamp);
  }
  return last + 1;
};

const updateUserLevel = async(userId) => {
  const betsSum = await db.bets.getSum({ userId });
  const level = utils.getLevel(betsSum);
  db.users.setLevel({ userId, level });
};

const processEvents = async(events) => {
  console.log(events);
  for (const data of events) {
    const {
      gameId: index, player: wallet, finishBlock, amount: bet, number, roll
    } = data.result;

    let userId = await db.users.getId({ wallet });
    if (!userId) userId = await db.users.add({ wallet });

    const response = await dice.getters.game({ gameId: index });
    const { result, status } = response.game;

    const gameId = await db.games.add({ index, finishBlock, result, status });

    const params = JSON.stringify({ number, roll });
    await db.bets.add({ gameId, userId, bet, params });
    updateUserLevel(userId);

    if (status === 'start') {
      setTimeout(() => { dice.control.finishGame({ gameId: index }); }, 2000);
    }
  }
};

(async() => {
  let from = 0;

  setInterval(async() => {
    const data = await dice.events.takeBets({ from });
    const { events } = data;

    from = lastTimestamp(events, from);
    processEvents(events);
  }, 1000);
})();
