const { MIN_OPERATION_PROFIT, DIVIDENDS_INTERVAL, FUND_DELAY } = process.env;
// const { TRONWEB_DELAY } = process.env;

const db = require('@db');
const { leftToPayout, operatingProfit } = require('@utils/dividends');
const { finishAuction } = require('@workers/auction/finish');
// const { bomb, portal, fund, tools } = require('@controllers/node');

const timeout = leftToPayout();
let chanel;

// const checkFund = (fund) => {
//   const funds = [
//     'ad', 'random-jackpot', 'bet-amount-jackpot',
//     'technical', 'referral-rewards', 'team', 'auction'
//   ];
//   return funds.includes(fund);
// };

const payRewards = async(profit) => {
  const usersAmounts = await db.freeze.getUsersAmounts();
  const totalFreeze = await db.freeze.getSum();

  for (const { wallet, amount } of usersAmounts) {
    const dividends = profit * (amount / totalFreeze);
    if (dividends > 0) await db.dividends.add({ wallet, amount: dividends });
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
  const { balance, profit } = await operatingProfit();
  await db.operationProfit.add({ balance, profit });

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

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
