const express = require('express');
const passport = require('passport');
const router = new express.Router();

const controller = require('@controllers/chat');
const validate = require('@middleware/validate');

router.route('/google/auth')
  .get(passport.authenticate('google', { scope: ['profile'] }));

router.route('/google/user')
  .get(controller.user);

router.route('/send')
  .post(validate('msg', false), controller.send);

router.route('/set_ban')
  .post(validate('setBan', false), controller.setBan);

module.exports = router;
