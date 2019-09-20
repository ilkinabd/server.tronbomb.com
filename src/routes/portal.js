const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const { admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/configs')
  .get(controller.getConfigs);

router.route('/mining_level')
  .get(controller.miningLevel);

router.route('/total_bet_prize')
  .get(controller.totalBetPrize);

router.route('/dividends_params')
  .get(controller.dividendsParams);

router.route('/jackpot_params')
  .get(controller.getJackpotParams);

router.route('/set_random_jackpot_winner')
  .post(admin, validate('jackpotWinner', false), controller.setJackpotWinner);

router.route('/random_jackpot_winner')
  .get(admin, controller.getJackpotWinner);

router.route('/history/random_jackpot')
  .get(controller.getRandomJackpotHistory);

router.route('/history/bet_amount_jackpot')
  .get(controller.getBetAmountJackpotHistory);

router.route('/auction_params')
  .get(controller.getAuctionParams);

router.route('/subscribe')
  .post(validate('mail', false), controller.subscribe);

router.route('/contracts/params')
  .get(admin, controller.getPortalParams);

router.route('/contracts/main_status')
  .get(admin, controller.getPortalStatus);

router.route('/contracts/set_main_status')
  .post(admin, validate('status', false), controller.setPortalStatus);

module.exports = router;
