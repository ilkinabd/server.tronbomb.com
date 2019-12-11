const {
  MIN_BET_SUM, PLACES, PRIZES, MIN_FUND, MAX_FUND,
} = JSON.parse(process.env.JACKPOTS);

const db = require('@db');
const { balance, transfer } = require('@controllers/node').fund;

const random = (max) => Math.floor(Math.random() * max);
const toDecimal = amount => Math.floor(amount * 1e6) / 1e6;

const getRandomWinners = async(members) => {
  const winners = [];

  for (let i = 0; i < PLACES; i++) {
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
    else winners[place - 1] = wallet;
  }

  await db.jackpots.deleteRandomUnconfirmed();
  return winners;
};

const payRewards = async(winners, chanel) => {
  const fund = 'random-jackpot';
  const { balanceTRX } = await balance({ type: fund });

  if (balanceTRX < MIN_FUND) return;
  const prizePool = Math.min(balanceTRX, MAX_FUND);

  const result = [];

  for (const i in winners) {
    const prize = toDecimal(prizePool * PRIZES[i]);
    const wallet = winners[i];

    await transfer({ to: wallet, amount: prize, type: fund });

    const type = 'random';
    const place = parseInt(i) + 1;
    const id = await db.jackpots.add({
      wallet,
      type,
      place,
      prize,
      status: true
    });
    result.push({ id, wallet, prize });
  }

  chanel.emit('random-jackpot', result);
};

module.exports = async(chanel) => {
  const users = await db.users.getTop({ limit: 1000 });
  const members = users.filter(e => e.betSum >= MIN_BET_SUM).map(e => e.wallet);

  const randomWinners = await getRandomWinners(members);
  const winners = await addWinnersFromDB(randomWinners);

  payRewards(winners, chanel);
};
