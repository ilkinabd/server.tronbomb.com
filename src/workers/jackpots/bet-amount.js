const { PLACES, PRIZES, MIN_FUND, MAX_FUND } = JSON.parse(process.env.JACKPOTS);

const db = require('@db');
const { balance, transfer } = require('@controllers/node').fund;

const toDecimal = amount => Math.floor(amount * 1e6) / 1e6;

const payRewards = async(winners, chanel) => {
  const fund = 'bet-amount-jackpot';
  const { balanceTRX } = await balance({ type: fund });

  if (balanceTRX < MIN_FUND) return;
  const prizePool = Math.min(balanceTRX, MAX_FUND);

  const result = [];

  for (const i in winners) {
    const prize = toDecimal(prizePool * PRIZES[i]);
    const wallet = winners[i];
    result.push({ wallet, prize });

    await transfer({ to: wallet, amount: prize, type: fund });

    const type = 'bet_amount';
    const place = parseInt(i) + 1;
    await db.jackpots.add({ wallet, type, place, prize, status: true });
  }

  chanel.emit('bet-amount-jackpot', result);
};

module.exports = async(chanel) => {
  const users = await db.users.getTop({ limit: PLACES });
  const winners = users.map(e => e.wallet);
  payRewards(winners, chanel);
};
