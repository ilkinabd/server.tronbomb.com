const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getId, getValue, getRow, getAll, fillTemplate } = require('./tools');

const tokens = require('./requests/tokens');
const gamesContracts = require('./requests/games-contracts');
const games = require('./requests/games');
const users = require('./requests/users');
const bets = require('./requests/bets');
const sockets = require('./requests/sockets');

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
  gamesContracts: {
    getAll: getAll(request(gamesContracts['get-all'])),
  },
  games: {
    add: getId(request(games['add'])),
    setFinish: request(games['set-finish']),
    getId: getId(request(games['get-id'])),
    getByLimit: getAll(request(games['get-by-limit'])),
  },
  users: {
    add: getId(request(users['add'])),
    setLevel: request(users['set-level']),
    get: getRow(request(users['get'])),
    getId: getId(request(users['get-id'])),
    getCount: getValue(request(users['get-count'])),
    getTop: getAll(request(users['get-top'])),
  },
  bets: {
    add: getId(request(bets['add'])),
    setPrize: request(bets['set-prize']),
    getByLimit: getAll(request(bets['get-by-limit'])),
    getSum: getValue(request(bets['get-sum'])),
  },
  sockets: {
    add: getId(request(sockets['add'])),
    setRooms: request(sockets['set-rooms']),
    delete: getAll(request(sockets['delete'])),
    clear: getValue(request(sockets['clear'])),
  },
};
