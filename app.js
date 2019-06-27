const {
  npm_package_version: version,
  // SECRET, NODE_ENV,
  // PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB,
  CORS_TRUST,
} = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// const PgStorage = require('connect-pg-simple')(session);
const cors = require('cors');

// Node updates routes
// const updates = require('@routes/node/updates');

// Users routes
// const auth = require('@routes/users/auth');
// const bots = require('@routes/users/bots');
// const players = require('@routes/users/players');

// Games routes
// const games = require('@routes/games/games');

// Store routes
// const ships = require('@routes/store/ships');

// const tournaments = require('./src/routes/tournaments');

// const conString = `postgres://${PG_USER}:${PG_PASS}@${PG_HOST}:${PG_PORT}/${PG_DB}`;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.json({
  type: ['application/json', 'text/plain']
}));

app.use((_req, res, next) => {
  //TODO: * => client URL
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors({
  origin: CORS_TRUST.split(','),
  credentials: true
}));

// app.use(session({
//   secret: SECRET,
//   resave: true,
//   saveUninitialized: false,
//   cookie: { secure: (NODE_ENV === 'production') },
//   store: new PgStorage({ conString }),
// }));

app.get('/', (_req, res) => {
  res.json({ version });
});
// app.get('/home', (_req, res) => res.redirect('/'));
// app.get('/index', (_req, res) => res.redirect('/'));

// app.use('/updates', updates);

// app.use('/auth', auth);
// app.use('/bots', bots);
// app.use('/players', players);

// app.use('/games', games);

// app.use('/ships', ships);

// app.use('/tournaments', tournaments);

module.exports = app;
