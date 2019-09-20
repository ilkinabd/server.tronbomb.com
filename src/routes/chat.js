const express = require('express');
const passport = require('passport');
const router = new express.Router();

const controller = require('@controllers/chat');
const { oauth } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/send').post(
  validate('msg', false),
  passport.authenticate('google-token', { session: false }),
  oauth,
  controller.send,
);

router.route('/set_ban').post(
  validate('setBan', false),
  passport.authenticate('google-token', { session: false }),
  oauth,
  controller.setBan,
);

module.exports = router;
