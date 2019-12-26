const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getId, getValue, getRow, getAll, fillTemplate } = require('./tools');

const auction = require('./requests/auction');
const users = require('./requests/users');
const sockets = require('./requests/sockets');
const chat = require('./requests/chat');
const configs = require('./requests/configs');
const bans = require('./requests/bans');
const burn = require('./requests/burn');
const freeze = require('./requests/freeze');
const i18n = require('./requests/i18n');
const oauthUsers = require('./requests/oauth-users');
const operationProfit = require('./requests/operation-profit');
const dividends = require('./requests/dividends');
const jackpots = require('./requests/jackpots');

const dice = require('./requests/dice');
const coin = require('./requests/coin');
const wheel = require('./requests/wheel');
const referrals = require('./requests/referrals');

const client = new PgClient({
  host: PG_HOST,
  user: PG_USER,
  port: PG_PORT,
  password: PG_PASS,
  database: PG_DB,
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
  auction: {
    add: getValue(request(auction['add'])),
    setPrize: request(auction['set-prize']),
    finishAll: request(auction['finish-all']),
    getMaxBet: getValue(request(auction['get-max-bet'])),
    getByLimit: getAll(request(auction['get-by-limit'])),
    getAll: getAll(request(auction['get-all'])),
    getLastWinner: getRow(request(auction['get-last-winner'])),
  },
  bans: {
    add: getId(request(bans['add'])),
    get: getRow(request(bans['get'])),
  },
  chat: {
    add: getId(request(chat['add'])),
    getLasts: getAll(request(chat['get-lasts'])),
  },
  configs: {
    get: getValue(request(configs['get'])),
    set: request(configs['set']),
  },
  dice: {
    add: getId(request(dice['add'])),
    setFinish: request(dice['set-finish']),
    setConfirm: request(dice['set-confirm']),
    getBetCount: getValue(request(dice['get-bet-count'])),
    getPrizeSum: getValue(request(dice['get-prize-sum'])),
    getProfit: getValue(request(dice['get-profit'])),
    getByWallet: getAll(request(dice['get-by-wallet'])),
    getByFinishBlock: getAll(request(dice['get-by-finish-block'])),
    getNonFinished: getAll(request(dice['get-non-finished'])),
    getByLimit: getAll(request(dice['get-by-limit'])),
  },
  coin: {
    add: getId(request(coin['add'])),
    setFinish: request(coin['set-finish']),
    setConfirm: request(coin['set-confirm']),
    // getBetCount:      getValue(request(dice['get-bet-count'])),
    // getPrizeSum:      getValue(request(dice['get-prize-sum'])),
    getProfit: getValue(request(coin['get-profit'])),
    getByWallet: getAll(request(coin['get-by-wallet'])),
    getByFinishBlock: getAll(request(coin['get-by-finish-block'])),
    getNonFinished: getAll(request(coin['get-non-finished'])),
    getByLimit: getAll(request(coin['get-by-limit'])),
  },
  referrals: {
    add: getId(request(referrals['add'])),
    getTypeByWallet: getAll(request(referrals['get-type-by-wallet'])),
  },
  users: {
    add: getId(request(users['add'])),
    setLevel: request(users['set-level']),
    setRefId: getValue(request(users['set-ref-id'])),
    setReferrer: request(users['set-referrer']),
    setRefProfit: request(users['set-ref-profit']),
    setMine: request(users['set-mine']),
    isExist: getValue(request(users['is-exist'])),
    getId: getId(request(users['get-id'])),
    getLevel: getValue(request(users['get-level'])),
    getReferrers: getValue(request(users['get-referrers'])),
    getReferrals: getAll(request(users['get-referrals'])),
    getReferralsCount: getValue(request(users['get-referrals-count'])),
    getRefId: getValue(request(users['get-ref-id'])),
    getRefProfit: getValue(request(users['get-ref-profit'])),
    getMine: getValue(request(users['get-mine'])),
    getWalletByRefId: getValue(request(users['get-wallet-by-ref-id'])),
    getCount: getValue(request(users['get-count'])),
    getBetSum: getValue(request(users['get-bet-sum'])),
    getTRXBetSum: getValue(request(users['get-trx-bet-sum'])),
    getWinSum: getValue(request(users['get-win-sum'])),
    getTop: getAll(request(users['get-top'])),
    getTop24: getAll(request(users['get-top-24'])),
    getAllBets: getAll(request(users['get-all-bets'])),
  },
  sockets: {
    add: getId(request(sockets['add'])),
    setRooms: request(sockets['set-rooms']),
    delete: getAll(request(sockets['delete'])),
    clear: getValue(request(sockets['clear'])),
  },
  burn: {
    add: getId(request(burn['add'])),
    getSum: getValue(request(burn['get-sum'])),
    getByLimit: getAll(request(burn['get-by-limit'])),
  },
  freeze: {
    add: getId(request(freeze['add'])),
    cancelAllUnfreeze: request(freeze['cancel-all-unfreeze']),
    setComplete: request(freeze['set-complete']),
    getAwaiting: getAll(request(freeze['get-awaiting'])),
    getAwaitingByWallet: getRow(request(freeze['get-awaiting-by-wallet'])),
    getSum: getValue(request(freeze['get-sum'])),
    getByWallet: getAll(request(freeze['get-by-wallet'])),
    getUserSum: getValue(request(freeze['get-user-sum'])),
    getUsersSums: getAll(request(freeze['get-users-sums'])),
    getByTypeLimit: getAll(request(freeze['get-by-type-limit'])),
  },
  i18n: {
    getPath: getValue(request(i18n['get-path'])),
    getLanguages: getValue(request(i18n['get-languages'])),
  },
  oauthUsers: {
    add: getId(request(oauthUsers['add'])),
    get: getRow(request(oauthUsers['get'])),
  },
  operationProfit: {
    add: getId(request(operationProfit['add'])),
    getMinus: getValue(request(operationProfit['get-minus'])),
    getNoComplete: getValue(request(operationProfit['get-no-complete'])),
    setCompleteAll: request(operationProfit['set-complete-all']),
  },
  dividends: {
    add: getId(request(dividends['add'])),
    getUserSum: getValue(request(dividends['get-user-sum'])),
    getByWallet: getAll(request(dividends['get-by-wallet'])),
    getByLimit: getAll(request(dividends['get-by-limit'])),
  },
  jackpots: {
    add: getId(request(jackpots['add'])),
    getRandomUnconfirmed: getAll(request(jackpots['get-random-unconfirmed'])),
    deleteRandomUnconfirmed: request(jackpots['delete-random-unconfirmed']),
    getByType: getAll(request(jackpots['get-by-type'])),
    getNotShown: getAll(request(jackpots['get-not-shown'])),
    setPopupShown: getAll(request(jackpots['set-popup-shown'])),
  },
  wheel: {
    add: getId(request(wheel['add'])),
    setFinish: request(wheel['set-finish']),
    setConfirm: request(wheel['set-confirm']),
    getBetCount: getValue(request(wheel['get-bet-count'])),
    getPrizeSum: getValue(request(wheel['get-prize-sum'])),
    getProfit: getValue(request(wheel['get-profit'])),
    getByStatus: getAll(request(wheel['get-by-status'])),
    getByWallet: getAll(request(wheel['get-by-wallet'])),
    getByLimit: getAll(request(wheel['get-by-limit'])),
  },
};
