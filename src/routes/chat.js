const express = require('express');
const router = new express.Router();

const controller = require('@controllers/chat');
const { googleOauth, fbOauth } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/google/user')
  .post(validate('oauth', false), googleOauth, controller.user);

router.route('/facebook/user')
  .post(validate('oauth', false), fbOauth, controller.user);

router.route('/google/send')
  .post(validate('msg', false), googleOauth, controller.send);

router.route('/facebook/send')
  .post(validate('msg', false), fbOauth, controller.send);

router.route('/google/set_ban')
  .post(validate('setBan', false), googleOauth, controller.setBan);

router.route('/facebook/set_ban')
  .post(validate('setBan', false), fbOauth, controller.setBan);

module.exports = router;
