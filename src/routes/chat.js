const express = require('express');
const passport = require('passport');
const router = new express.Router();

const controller = require('@controllers/chat');
const { admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/google/auth')
  .get(passport.authenticate('google', { scope: ['profile'] }));

router.route('/google/redirect')
  .get(passport.authenticate('google'), controller.redirect);

router.route('/send')
  .post(validate('msg', false), controller.send);

router.route('/get_ban_status')
  .get(validate('wallet'), controller.getBanStatus);

router.route('/add_ban')
  .post(admin, validate('addBan', false), controller.addBan);

module.exports = router;
