const {
  version, CORS_TRUST, GOOGLE_CLIENT_ID, GOOGLE_SECRET, COOKIE_KEY,
} = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

const db = require('@db');

const bomb = require('@routes/bomb');
const chat = require('@routes/chat');
const user = require('@routes/user');
const portal = require('@routes/portal');
const referral = require('@routes/referral');

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

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [COOKIE_KEY],
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async(id, done) => {
  const user = await db.oauthUsers.get({ index: id });
  done(null, user);
});

passport.use(
  new GoogleStrategy({
    callbackURL: '/chat/google/redirect',
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET,
  }, async(_accessToken, _refreshToken, profile, done) => {
    const user = { index: profile.id, name: profile.displayName };
    await db.oauthUsers.add(user);
    done(null, user);
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
