const { ADMIN_TOKEN, RECAPTCHA } = process.env;
const { SECRET_KEY, VERIFY_URL } = JSON.parse(RECAPTCHA);

const passport = require('passport');
const { errorRes } = require('@utils/res-builder');
const querystring = require('querystring');
const axios = require('axios');

const admin = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) return errorRes(res, 401, 73404);
  if (token !== ADMIN_TOKEN) return errorRes(res, 403, 73405);

  next();
};

const recaptchaVerify = async(req, res, next) => {
  const response = req.body['g-recaptcha-response'];
  const body = {
    secret: SECRET_KEY,
    response
  };
  const result = await axios.post(VERIFY_URL, querystring.stringify(body));
  if (!result.data) return errorRes(res, 401, 73413);
  if (result.data.success !== true) return errorRes(res, 401, 73413);
  next();
};

const googleOauth = passport.authenticate('google-token', { session: false });
const fbOauth = passport.authenticate('facebook-token', { session: false });

module.exports = {
  admin,
  googleOauth,
  fbOauth,
  recaptchaVerify,
};
