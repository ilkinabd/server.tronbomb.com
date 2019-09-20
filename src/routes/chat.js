const express = require('express');
const router = new express.Router();

const controller = require('@controllers/chat');
const { googleOauth } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/user')
  .post(validate('oauth', false), googleOauth, controller.user);

router.route('/send')
  .post(validate('msg', false), googleOauth, controller.send);

router.route('/set_ban')
  .post(validate('setBan', false), googleOauth, controller.setBan);

module.exports = router;
