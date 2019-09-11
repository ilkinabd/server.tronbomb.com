const { JACKPOT_MIN_BET_SUM, JACKPOT_WINNERS } = process.env;

const db = require('@db');

const random = (max) => Math.floor(Math.random() * max);

const randomWinners = (members) => {
  const winners = [];

  for (let i = 0; i < JACKPOT_WINNERS; i++) {
    const randomIndex = i + random(members.length - i);
    winners.push(members[randomIndex]);
    [members[i], members[randomIndex]] = [members[randomIndex], members[i]];
  }

  return winners;
};

module.exports = async() => {
  const users = await db.users.getTop({ limit: 1000 });
  const members = users.filter(e => e.betSum >= JACKPOT_MIN_BET_SUM)
    .map(e => e.wallet);

  const winners = randomWinners(members);

  console.log(winners);
};
