const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getId, getValue, getRow, getAll, fillTemplate } = require('./tools');

const users = require('./requests/users');
const sockets = require('./requests/sockets');
const messages = require('./requests/messages');
const bans = require('./requests/bans');
const burn = require('./requests/burn');
const freeze = require('./requests/freeze');
const operationProfit = require('./requests/operation-profit');
const dividends = require('./requests/dividends');
const jackpots = require('./requests/jackpots');
const auction = require('./requests/auction');

const dice = require('./requests/dice');
const wheel = require('./requests/wheel');
const referrals = require('./requests/referrals');

const client = new PgClient({
  host: PG_HOST,
  user: PG_USER,
  port: PG_PORT,
  password: PG_PASS,
  database: PG_DB
});
client.connect().catch(console.error);

const request = template => params => {
  const { sql, values } = fillTemplate(template, params);

  return client.query(sql, values).catch(error => {
    console.warn(sql, values);
    console.error(error);
  });
};

module.exports = {
  bans: {
    add: getId(request(bans['add'])),
    get: getRow(request(bans['get'])),
  },
  dice: {
    add:                 getId(request(dice['add'])),
    setFinish:                 request(dice['set-finish']),
    setConfirm:                request(dice['set-confirm']),
    getBetSum:        getValue(request(dice['get-bet-sum'])),
    getPrizeSum:      getValue(request(dice['get-prize-sum'])),
    getProfit:        getValue(request(dice['get-profit'])),
    getByWallet:        getAll(request(dice['get-by-wallet'])),
    getByFinishBlock:   getAll(request(dice['get-by-finish-block'])),
    getByLimit:         getAll(request(dice['get-by-limit'])),
  },
  referrals: {
    add:              getId(request(referrals['add'])),
    getTypeByWallet: getAll(request(referrals['get-type-by-wallet'])),
  },
  users: {
    add:                  getId(request(users['add'])),
    setLevel:                   request(users['set-level']),
    setRefId:          getValue(request(users['set-ref-id'])),
    setReferrer:                request(users['set-referrer']),
    setRefProfit:               request(users['set-ref-profit']),
    setMine:                    request(users['set-mine']),
    isExist:            getValue(request(users['is-exist'])),
    getId: getId(request(users['get-id'])),
    getLevel: getValue(request(users['get-level'])),
    getReferrer:       getValue(request(users['get-referrer'])),
    getReferrals:        getAll(request(users['get-referrals'])),
    getReferralsCount: getValue(request(users['get-referrals-count'])),
    getRefId:          getValue(request(users['get-ref-id'])),
    getRefProfit:      getValue(request(users['get-ref-profit'])),
    getMine:           getValue(request(users['get-mine'])),
    getWalletByRefId:  getValue(request(users['get-wallet-by-ref-id'])),
    getCount: getValue(request(users['get-count'])),
    getBetSum: getValue(request(users['get-bet-sum'])),
    getTRXBetSum: getValue(request(users['get-trx-bet-sum'])),
    getWinSum: getValue(request(users['get-win-sum'])),
    getTop: getAll(request(users['get-top'])),
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
  burn: {
    add: getId(request(burn['add'])),
    getSum: getValue(request(burn['get-sum'])),
    getByLimit: getAll(request(burn['get-by-limit'])),
  },
  freeze: {
    add:               getId(request(freeze['add'])),
    cancelAllUnfreeze:       request(freeze['cancel-all-unfreeze']),
    setComplete:             request(freeze['set-complete']),
    getAwaiting:      getAll(request(freeze['get-awaiting'])),
    getAwaitingByWallet: getRow(request(freeze['get-awaiting-by-wallet'])),
    getSum: getValue(request(freeze['get-sum'])),
    getByWallet: getAll(request(freeze['get-by-wallet'])),
    getUserSum: getValue(request(freeze['get-user-sum'])),
    getUsersAmounts: getAll(request(freeze['get-users-amounts'])),
    getByTypeLimit: getAll(request(freeze['get-by-type-limit'])),
  },
  operationProfit: {
    add: getId(request(operationProfit['add'])),
    getNoComplete: getValue(request(operationProfit['get-no-complete'])),
    setCompleteAll: request(operationProfit['set-complete-all']),
  },
  dividends: {
    add: getId(request(dividends['add'])),
    getUserSum: getValue(request(dividends['get-user-sum'])),
    getByWallet: getAll(request(dividends['get-by-wallet'])),
    getByLimit: getAll(request(dividends['get-by-limit'])),
  },
  auction: {
    add: getValue(request(auction['add'])),
    getMaxBet: getValue(request(auction['get-max-bet'])),
    getByLimit: getAll(request(auction['get-by-limit'])),
    getAll: getAll(request(auction['get-all'])),
    setPrize: request(auction['set-prize']),
    getLastWinner: getRow(request(auction['get-last-winner'])),
  },
  jackpots: {
    add: getId(request(jackpots['add'])),
    getRandomUnconfirmed: getAll(request(jackpots['get-random-unconfirmed'])),
    deleteRandomUnconfirmed: request(jackpots['delete-random-unconfirmed']),
    getAll: getAll(request(jackpots['get-all'])),
  },
  wheel: {
    add:            getId(request(wheel['add'])),
    setFinish:            request(wheel['set-finish']),
    setConfirm:           request(wheel['set-confirm']),
    getBetSum:   getValue(request(wheel['get-bet-sum'])),
    getPrizeSum: getValue(request(wheel['get-prize-sum'])),
    getProfit:   getValue(request(wheel['get-profit'])),
    getByStatus:   getAll(request(wheel['get-by-status'])),
    getByWallet:   getAll(request(wheel['get-by-wallet'])),
    getByLimit:    getAll(request(wheel['get-by-limit'])),
  },
};
