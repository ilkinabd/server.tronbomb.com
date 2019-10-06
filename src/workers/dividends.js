const {
  MIN_WITHDRAW, TRONWEB_DELAY, FREEZE, MINING, DIVIDENDS, JACKPOTS, AUCTION
} = process.env;
const { PROFIT } = JSON.parse(MINING);
const { FUND_DELAY } = JSON.parse(FREEZE);
const { INTERVAL, MIN_PROFIT, MIN_BALANCE } = JSON.parse(DIVIDENDS);
const { DELAY } = JSON.parse(JACKPOTS);
const { ACTIVE: AUCTION_ACTIVE } = JSON.parse(AUCTION);

const db = require('@db');
const { round, leftToPayout, operatingProfit } = require('@utils/dividends');
const auction = require('@workers/auction/finish');
const { portal, fund } = require('@controllers/node');
const randomJackpot = require('@workers/jackpots/random');
const betAmountJackpot = require('@workers/jackpots/bet-amount');

const withdraw = async(data) => {
  const { wallet } = data;

  const amount = await db.dividends.getUserSum({ wallet });
  if (amount < MIN_WITHDRAW) return;

  console.info(`Withdraw ${amount} from ${wallet}.`);
  const type = 'withdraw';
  await db.dividends.add({ wallet, amount: -amount, type });
  portal.func.withdraw({ to: wallet, amount });
};

const freezeFunds = async() => {
  console.info('Freeze for funds.');
  const funds = Object.keys(PROFIT);

  for (const type of funds) {
    console.info(`Mine from ${type} fund.`);
    await fund.mine({ type });

    setTimeout(() => {
      console.info(`Freeze all from ${type} fund.`);
      fund.freezeAll({ type });
    }, TRONWEB_DELAY);
  }
};

const withdrawFundsProfit = async() => {
  const funds = Object.keys(PROFIT);
  for (const type of funds) fund.withdrawDividends({ type });
};

const payRewards = async(profit) => {
  const usersSums = await db.freeze.getUsersSums();
  const total = await db.freeze.getSum();

  for (const { wallet, sum } of usersSums) {
    const amount = round(profit * (sum / total));
    if (amount === 0) continue;

    db.dividends.add({ wallet, amount, type: 'deposit' });
  }

  withdrawFundsProfit();
};

const calculateProfit = async() => {
  const intervalProfit = await operatingProfit();
  await db.operationProfit.add({ profit: intervalProfit });

  const profit = (await db.operationProfit.getNoComplete()) - MIN_BALANCE;
  if (profit > MIN_PROFIT) {
    if (AUCTION_ACTIVE) await auction(this.io.in('auction'));
    payRewards(profit);
    await db.operationProfit.setCompleteAll();
  }

  setTimeout(freezeFunds, INTERVAL - FUND_DELAY);

  console.info('Preparing jackpots.');
  if (await db.configs.get({ key: 'RANDOM_JACKPOT_STATUS' }))
    setTimeout(() => { randomJackpot(this.io.in('jackpots')); }, DELAY);
  if (await db.configs.get({ key: 'BET_AMOUNT_JACKPOT_STATUS' }))
    setTimeout(() => { betAmountJackpot(this.io.in('jackpots')); }, DELAY);
};

module.exports = (node, io) => {
  node.on('withdraw-dividends', withdraw);
  this.io = io;

  const timeout = leftToPayout();

  setTimeout(freezeFunds, timeout - FUND_DELAY);

  setTimeout(() => {
    setInterval(calculateProfit, INTERVAL);
    calculateProfit();
  }, timeout);
};
