const {
  NODE, NODE_TOKEN,
  MIN_OPERATION_PROFIT, DIVIDENDS_INTERVAL, FUND_DELAY,
} = process.env;
// const { TRONWEB_DELAY } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { leftToPayout, operatingProfit } = require('@utils/dividends');
const { finishAuction } = require('@workers/auction/finish');
const { /*bomb, */portal/*, fund, tools*/ } = require('@controllers/node');

const socket = io.connect(NODE, { reconnect: true });

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'operations',
    token: NODE_TOKEN,
  });
});

const timeout = leftToPayout();
let chanel;

// const checkFund = (fund) => {
//   const funds = [
//     'ad', 'random-jackpot', 'bet-amount-jackpot',
//     'technical', 'referral-rewards', 'team', 'auction'
//   ];
//   return funds.includes(fund);
// };

const withdraw = async(data) => {
  const { wallet } = data;
  const amount = await db.dividends.getUserSum({ wallet });
  if (amount < 10) return;

  const type = 'withdraw';
  await db.dividends.add({ wallet, amount: -amount, type });

  const params = { to: wallet, amount };
  const result = await portal.func.withdraw(params);
  console.info('Withdraw dividends:', wallet, result);
};

const payRewards = async(profit) => {
  const usersAmounts = await db.freeze.getUsersAmounts();
  const totalFreeze = await db.freeze.getSum();

  for (const { wallet, amount } of usersAmounts) {
    const sum = profit * (amount / totalFreeze);
    const type = 'deposit';
    if (sum > 0) await db.dividends.add({ wallet, amount: sum, type });
  }
};

const freezeFunds = async() => {
  console.log('freeze', new Date());

  // const { funds } = await tools.getFunds();

  // for (const { address: wallet, type } of funds) {
  //   if (!checkFund(type)) continue;

  //   const sum = await db.mining.getUserSum({ wallet });
  //   if (sum < 0) continue;

  //   await db.mining.add({ type: 'withdraw', wallet, amount: -sum });
  //   await bomb.func.transfer({ to: wallet, amount: sum });

  //   setTimeout(() => { fund.freezeAll({ type }); }, TRONWEB_DELAY);
  // }
};

const calculateProfit = async() => {
  const profit = await operatingProfit();
  await db.operationProfit.add({ profit });

  const noCompleteProfit = await db.operationProfit.getNoComplete();
  if (noCompleteProfit > MIN_OPERATION_PROFIT) {
    await finishAuction(chanel);
    payRewards(noCompleteProfit);

    await db.operationProfit.setCompleteAll();
  }

  setTimeout(freezeFunds, DIVIDENDS_INTERVAL - FUND_DELAY);
};

setTimeout(freezeFunds, timeout - FUND_DELAY);

setTimeout(() => {
  setInterval(calculateProfit, DIVIDENDS_INTERVAL);
  calculateProfit();
}, timeout);

socket.on('withdraw-dividends', withdraw);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
