const { version, CORS_TRUST, GOOGLE_CLIENT_ID, GOOGLE_SECRET } = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

const db = require('@db');

const bomb = require('@routes/bomb');
const chat = require('@routes/chat');
const user = require('@routes/user');
const portal = require('@routes/portal');
const referral = require('@routes/referral');

const admins = JSON.parse(process.env.CHAT_ADMINS);

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

passport.use(
  new GoogleTokenStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET,
  }, async(_accessToken, _refreshToken, profile, done) => {
    const user = { index: profile.id, name: profile.displayName };
    await db.oauthUsers.add(user);
    user.admin = admins.includes(profile.id),
    done(null, user);
  })
);

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

module.exports = app;
