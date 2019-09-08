const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const validate = require('@middleware/validate');

router.route('/configs')
  .get(controller.getConfigs);

router.route('/total_bet_prize')
  .get(controller.totalBetPrize);

router.route('/subscribe')
  .post(validate('mail', false), controller.subscribe);

module.exports = router;
