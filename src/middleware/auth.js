const { ADMIN_TOKEN } = process.env;

const passport = require('passport');
const { errorRes } = require('@utils/res-builder');

const admin = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) return errorRes(res, 401, 73404);
  if (token !== ADMIN_TOKEN) return errorRes(res, 403, 73405);

  next();
};

const googleOauth = passport.authenticate('google-token', { session: false });
const fbOauth = passport.authenticate('facebook-token', { session: false });

module.exports = {
  admin,
  googleOauth,
  fbOauth,
};
