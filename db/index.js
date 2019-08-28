const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getId, getValue, getRow, getAll, fillTemplate } = require('./tools');

const tokens = require('./requests/tokens');
const users = require('./requests/users');
const sockets = require('./requests/sockets');
const messages = require('./requests/messages');
const bans = require('./requests/bans');
const refPayments = require('./requests/ref-payments');
const refWithdraws = require('./requests/ref-withdraws');
const burn = require('./requests/burn');
const freeze = require('./requests/freeze');
const operationProfit = require('./requests/operation-profit');
const dividends = require('./requests/dividends');

const dice = require('./requests/dice');
const wheel = require('./requests/wheel');

const auction = require('./requests/auction');

const client = new PgClient({
  host: PG_HOST,
  user: PG_USER,
  port: PG_PORT,
  password: PG_PASS,
  database: PG_DB
});
client.connect().catch(console.error);

const query = sql => (client
  .query(sql)
  .catch(error => {
    console.warn(sql);
    console.error(error);
  })
);
const request = template => params => {
  const sql = fillTemplate(template, params);
  return query(sql);
};

module.exports = {
  bans: {
    add: getId(request(bans['add'])),
    get: getRow(request(bans['get'])),
  },
  tokens: {
    getSymbol: getValue(request(tokens['get-symbol'])),
    getAll: getAll(request(tokens['get-all'])),
  },
  users: {
    add: getId(request(users['add'])),
    setLevel: request(users['set-level']),
    setRefId: getValue(request(users['set-ref-id'])),
    setRefProfit: getValue(request(users['set-ref-profit'])),
    getId: getId(request(users['get-id'])),
    getLevel: getValue(request(users['get-level'])),
    getReferrer: getValue(request(users['get-referrer'])),
    getRefId: getValue(request(users['get-ref-id'])),
    getRefProfit: getValue(request(users['get-ref-profit'])),
    getWalletByRefId: getValue(request(users['get-wallet-by-ref-id'])),
    getReferrals: getValue(request(users['get-referrals'])),
    getReferralsCount: getValue(request(users['get-referrals-count'])),
    getCount: getValue(request(users['get-count'])),
    getBetSum: getValue(request(users['get-bet-sum'])),
    getTRXBetSum: getValue(request(users['get-trx-bet-sum'])),
    getWinSum: getValue(request(users['get-win-sum'])),
    getTop: getAll(request(users['get-top'])),
  },
  refPayments: {
    add: getId(request(refPayments['add'])),
    getByWallet: getAll(request(refPayments['get-by-wallet'])),
    getGroupByWallet: getAll(request(refPayments['get-group-by-wallet'])),
  },
  refWithdraws: {
    add: getId(request(refWithdraws['add'])),
    setComplete: getRow(request(refWithdraws['set-complete'])),
    getByWallet: getAll(request(refWithdraws['get-by-wallet'])),
    getByCode: getRow(request(refWithdraws['get-by-code'])),
  },
  sockets: {
    add: getId(request(sockets['add'])),
    setRooms: request(sockets['set-rooms']),
    delete: getAll(request(sockets['delete'])),
    clear: getValue(request(sockets['clear'])),
  },
  messages: {
    add: getValue(request(messages['add'])),
    getByLimit: getAll(request(messages['get-by-limit'])),
  },
  dice: {
    add: getId(request(dice['add'])),
    setFinish: request(dice['set-finish']),
    setConfirm: request(dice['set-confirm']),
    getByIndex: getRow(request(dice['get-by-index'])),
    getByWallet: getAll(request(dice['get-by-wallet'])),
    getByFinishBlock: getAll(request(dice['get-by-finish-block'])),
    getByLimit: getAll(request(dice['get-by-limit'])),
  },
  wheel: {
    add: getValue(request(wheel['add'])),
    setFinish: request(wheel['set-finish']),
    setConfirm: request(wheel['set-confirm']),
    getByStatus: getAll(request(wheel['get-by-status'])),
    getByWallet: getAll(request(wheel['get-by-wallet'])),
    getByLimit: getAll(request(wheel['get-by-limit'])),
  },
  burn: {
    add: getId(request(burn['add'])),
    getByLimit: getAll(request(burn['get-by-limit'])),
  },
  freeze: {
    add: getId(request(freeze['add'])),
    setComplete: request(freeze['set-complete']),
    getAwaiting: getAll(request(freeze['get-awaiting'])),
    getSum: getValue(request(freeze['get-sum'])),
    getByWallet: getAll(request(freeze['get-by-wallet'])),
    getByLimit: getAll(request(freeze['get-by-limit'])),
    getUserSum: getValue(request(freeze['get-user-sum'])),
    getUsersAmounts: getAll(request(freeze['get-users-amounts'])),
  },
  operationProfit: {
    add: getId(request(operationProfit['add'])),
    getNoComplete: getValue(request(operationProfit['get-no-complete'])),
    setCompleteAll: request(operationProfit['set-complete-all']),
  },
  dividends: {
    add: getId(request(dividends['add'])),
    getUserSum: getValue(request(dividends['get-user-sum'])),
  },
  auction: {
    add: getId(request(auction['add'])),
    getMaxBet: getValue(request(auction['get-max-bet'])),
    getAllBets: getAll(request(auction['get-all-bets'])),
    setPrize: request(auction['set-prize']),
  },
};
