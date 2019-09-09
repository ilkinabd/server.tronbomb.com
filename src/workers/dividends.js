const { DIVIDENDS_INTERVAL, FUND_DELAY } = process.env;
// const { MIN_OPERATION_PROFIT, TRONWEB_DELAY } = process.env;

const { leftToPayout/*, operatingProfit*/ } = require('@utils/dividends');
// const { bomb, portal, fund, tools } = require('@controllers/node');
// const db = require('@db');
// const { finishAuction } = require('@workers/auction/finish');

const timeout = leftToPayout();

// let chanel;

// const checkFund = (fund) => {
//   const funds = [
//     'ad', 'random-jackpot', 'bet-amount-jackpot',
//     'technical', 'referral-rewards', 'team', 'auction'
//   ];
//   return funds.includes(fund);
// };

// const fillPortal = async(profit) => {
//   const amount = -profit;

//   const { address } = await portal.get.params();

//   const params = { type: 'reserve', to: address, amount };
//   await fund.transfer(params);
// };

// const payRewards = async(profit) => {
//   await db.operationProfit.setCompleteAll();

//   const usersAmounts = await db.freeze.getUsersAmounts();
//   const totalFreeze = await db.freeze.getSum();

//   for (const { wallet, amount } of usersAmounts) {
//     const dividend = profit * (amount / totalFreeze);

//     const params = { to: wallet, amount: dividend };

//     const result = await portal.func.withdraw(params);
//     if (result.status === 'success')
//       await db.dividends.add({ wallet, amount: dividend });
//   }
// };

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
  console.log('profit', new Date());

  // const amount = await operatingProfit();

  // await db.operationProfit.add({ amount });

  // if (amount < 0) return await fillPortal(amount);

  // const noCompleteProfit = await db.operationProfit.getNoComplete();
  // if (noCompleteProfit > MIN_OPERATION_PROFIT) {
  //   await finishAuction(chanel);
  //   payRewards(noCompleteProfit);
  // }

  setTimeout(freezeFunds, DIVIDENDS_INTERVAL - FUND_DELAY);
};

setTimeout(freezeFunds, timeout - FUND_DELAY);

setTimeout(() => {
  setInterval(calculateProfit, DIVIDENDS_INTERVAL);
  calculateProfit();
}, timeout);

module.exports = (/*ioChanel*/) => {
  // chanel = ioChanel;
};
