const { JACKPOT_MIN_BET_SUM, JACKPOT_WINNERS } = process.env;

const db = require('@db');

const random = (max) => Math.floor(Math.random() * max);

const getRandomWinners = async(members) => {
  const winners = [];

  for (let i = 0; i < JACKPOT_WINNERS; i++) {
    const randomIndex = i + random(members.length - i);
    winners.push(members[randomIndex]);
    [members[i], members[randomIndex]] = [members[randomIndex], members[i]];
  }

  return winners;
};

const addWinnersFromDB = async(winners) => {
  const dbWinners = await db.jackpots.getRandomUnconfirmed();

  for (const { place, wallet } of dbWinners) {
    const i = winners.indexOf(wallet);
    if (i >= 0)
      [winners[place - 1], winners[i]] = [winners[i], winners[place - 1]];
    else winners[place] = wallet;
  }

  return winners;
};

module.exports = async() => {
  const users = await db.users.getTop({ limit: 1000 });
  const members = users.filter(e => e.betSum >= JACKPOT_MIN_BET_SUM)
    .map(e => e.wallet);

  const randomWinners = await getRandomWinners(members);
  const winners = await addWinnersFromDB(randomWinners);

  console.log(winners);
};
