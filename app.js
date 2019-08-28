const { version, CORS_TRUST } = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const bomb = require('@routes/bomb');
const chat = require('@routes/chat');
const user = require('@routes/user');
const portal = require('@routes/portal');
const referral = require('@routes/referral');
const dividends = require('@routes/dividends');
const auction = require('@routes/auction');

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

app.get('/', (_req, res) => {
  res.json({ version });
});

app.use('/bomb', bomb);
app.use('/chat', chat);
app.use('/user', user);
app.use('/portal', portal);
app.use('/referral', referral);
app.use('/dividends', dividends);
app.use('/auction', auction);

module.exports = app;
