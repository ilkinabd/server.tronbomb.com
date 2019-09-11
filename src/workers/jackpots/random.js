const { JACKPOT_MIN_BET_SUM, JACKPOT_PLACES, JACKPOTS_PRIZES } = process.env;

const db = require('@db');
const { balance, transfer } = require('@controllers/node').fund;

const prizes = Array.from(JACKPOTS_PRIZES.split(','), parseFloat);

const random = (max) => Math.floor(Math.random() * max);

const getRandomWinners = async(members) => {
  const winners = [];

  for (let i = 0; i < JACKPOT_PLACES; i++) {
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

  await db.jackpots.deleteRandomUnconfirmed();

  return winners;
};

const payRewards = async(winners, chanel) => {
  const type = 'random-jackpot';
  const { balanceTRX } = await balance({ type });

  if (balanceTRX < 10) return;

  const result = [];

  for (const i in winners) {
    const prize = balanceTRX * prizes[i];
    const wallet = winners[i];
    result.push({ wallet, prize });

    await transfer({ to: wallet, amount: prize, type });

    await db.jackpots.add({
      wallet,
      type: 'random',
      place: parseInt(i) + 1,
      prize,
      status: true,
    });
  }

  chanel.emit('random-jackpot', result);
};

module.exports = async(chanel) => {
  const users = await db.users.getTop({ limit: 1000 });
  const members = users.filter(e => e.betSum >= JACKPOT_MIN_BET_SUM)
    .map(e => e.wallet);

  const randomWinners = await getRandomWinners(members);
  const winners = await addWinnersFromDB(randomWinners);

  payRewards(winners, chanel);
};
