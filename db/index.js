const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getId, getValue, getRow, getAll, fillTemplate } = require('./tools');

const tokens = require('./requests/tokens');
const users = require('./requests/users');
const refs = require('./requests/refs');
const sockets = require('./requests/sockets');
const messages = require('./requests/messages');
const bans = require('./requests/bans');

// Dice
const dice = require('./requests/dice');
const diceBets = require('./requests/dice-bets');

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
  tokens: {
    getAll: getAll(request(tokens['get-all'])),
  },
  users: {
    add: getId(request(users['add'])),
    addReferrer: getId(request(users['add-ref'])),
    setLevel: request(users['set-level']),
    get: getRow(request(users['get'])),
    getId: getId(request(users['get-id'])),
    getCount: getValue(request(users['get-count'])),
    getTop: getAll(request(users['get-top'])),
  },
  refs: {
    add: getId(request(refs['add'])),
    addId: getId(request(refs['add-id'])),
    isExist: getValue(request(refs['is-exist'])),
    get: getValue(request(refs['get'])),
    getWallet: getValue(request(refs['get-wallet'])),
    getUserId: getValue(request(refs['get-user-id'])),
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
  bans: {
    add: getId(request(bans['add'])),
    setStatus: request(bans['set-status']),
    get: getRow(request(bans['get'])),
    getStatus: getValue(request(bans['get-status'])),
    getActive: getAll(request(bans['get-active'])),
  },
  dice: {
    add: getId(request(dice['add'])),
    setFinish: request(dice['set-finish']),
    setConfirm: request(dice['set-confirm']),
    getId: getId(request(dice['get-id'])),
    getByFinishBlock: getAll(request(dice['get-by-finish-block'])),
    getByLimit: getAll(request(dice['get-by-limit'])),
  },
  diceBets: {
    add: getId(request(diceBets['add'])),
    setPrize: request(diceBets['set-prize']),
    setConfirm: request(diceBets['set-confirm']),
    getByLimit: getAll(request(diceBets['get-by-limit'])),
    getByIndex: getRow(request(diceBets['get-by-index'])),
    getSum: getValue(request(diceBets['get-sum'])),
  },
};
