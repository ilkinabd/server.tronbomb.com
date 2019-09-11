const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const { admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/configs')
  .get(controller.getConfigs);

router.route('/total_bet_prize')
  .get(controller.totalBetPrize);

router.route('/dividends_params')
  .get(controller.dividendsParams);

router.route('/random_jackpot_params')
  .get(controller.getRandomJackpotParams);

router.route('/set_random_jackpot_winner')
  .post(admin, validate('jackpotWinner', false), controller.setJackpotWinner);

router.route('/subscribe')
  .post(validate('mail', false), controller.subscribe);

module.exports = router;
