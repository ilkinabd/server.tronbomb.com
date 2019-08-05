const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getId, getValue, getRow, getAll, fillTemplate } = require('./tools');

const tokens = require('./requests/tokens');
const users = require('./requests/users');
const sockets = require('./requests/sockets');
const messages = require('./requests/messages');
const bans = require('./requests/bans');

// Dice
const dice = require('./requests/dice');
const diceBets = require('./requests/dice-bets');

// Wheel
const wheel = require('./requests/wheel');
const wheelBets = require('./requests/wheel-bets');

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
    getAll: getAll(request(tokens['get-all'])),
  },
  users: {
    add: getId(request(users['add'])),
    setLevel: request(users['set-level']),
    setRefId: getValue(request(users['set-ref-id'])),
    getLevel: getValue(request(users['get-level'])),
    getId: getId(request(users['get-id'])),
    getRefId: getValue(request(users['get-ref-id'])),
    getWalletByRefId: getValue(request(users['get-wallet-by-ref-id'])),
    getCount: getValue(request(users['get-count'])),
    getBetSum: getValue(request(users['get-bet-sum'])),
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
  dice: {
    add: getId(request(dice['add'])),
    setFinish: request(dice['set-finish']),
    setConfirm: request(dice['set-confirm']),
    getId: getId(request(dice['get-id'])),
    getByIndex: getRow(request(dice['get-by-index'])),
    getByFinishBlock: getAll(request(dice['get-by-finish-block'])),
    getByLimit: getAll(request(dice['get-by-limit'])),
  },
  diceBets: {
    add: getId(request(diceBets['add'])),
    setPrize: request(diceBets['set-prize']),
    setConfirm: request(diceBets['set-confirm']),
    getSum: getValue(request(diceBets['get-sum'])),
    getAllByWallet: getAll(request(diceBets['get-all-by-wallet'])),
  },
  wheel: {
    add: getId(request(wheel['add'])),
    setFinish: request(wheel['set-finish']),
    setConfirm: request(wheel['set-confirm']),
    getId: getId(request(wheel['get-id'])),
    getLastGame: getRow(request(wheel['get-last-game'])),
    getIndexByBlock: getValue(request(wheel['get-index-by-block'])),
    getByFinishBlock: getAll(request(wheel['get-by-finish-block'])),
  },
  wheelBets: {
    add: getId(request(wheelBets['add'])),
    getByGame: getAll(request(wheelBets['get-by-game'])),
    setPrize: request(wheelBets['set-prize']),
    setConfirm: request(wheelBets['set-confirm']),
    getSum: getValue(request(wheelBets['get-sum'])),
    getAllByWallet: getAll(request(wheelBets['get-all-by-wallet'])),
  },
};
