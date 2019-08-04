const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const validate = require('@middleware/validate');

router.route('/configs')
  .get(controller.getConfigs);

router.route('/subscribe')
  .post(validate('subscribe', false), controller.subscribe);

module.exports = router;
