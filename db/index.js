const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getAll, fillTemplate } = require('./tools');

const tokens = require('./requests/tokens');

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
  }
};
