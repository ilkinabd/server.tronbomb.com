const db = require('@db');
const node = require('@utils/node');
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

const processEvents = async(events, contractId) => {
  for (const data of events) {
    const {
      gameId, userWallet: wallet, finishBlock, userBet, number, roll
    } = data.result;

    let userId = await db.users.getId({ wallet });
    if (!userId) userId = await db.users.add({ wallet });

    const game = await db.games.add({ gameId, contractId, finishBlock });
    if (game === null) return;

    const bet = userBet / 10 ** 6;
    const params = JSON.stringify({ number, roll });
    await db.bets.add({ gameId, userId, bet, params });

    updateUserLevel(userId);
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
      processEvents(events, contractId);
    }, 5000);
  }
})();
