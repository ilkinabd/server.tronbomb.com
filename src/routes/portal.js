const express = require('express');
const router = new express.Router();

const main = require('@controllers/portal');
const jackpots = require('@controllers/portal/jackpots');
const { admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Main

router.route('/configs')
  .get(main.getConfigs);

router.route('/mining_level')
  .get(main.miningLevel);

router.route('/total_bet_prize')
  .get(main.totalBetPrize);

router.route('/dividends_params')
  .get(main.dividendsParams);

router.route('/auction_params')
  .get(main.getAuctionParams);

router.route('/subscribe')
  .post(validate('mail', false), main.subscribe);

router.route('/contracts/params')
  .get(admin, main.getPortalParams);

router.route('/contracts/main_status')
  .get(admin, main.getPortalStatus);

router.route('/contracts/set_main_status')
  .post(admin, validate('status', false), main.setPortalStatus);

router.route('/admin_login')
  .post(validate('login', false), main.adminLogin);

// Jackpots

router.route('/jackpots/params')
  .get(jackpots.params);

router.route('/set_random_jackpot_winner')
  .post(admin, validate('jackpotWinner', false), jackpots.setJackpotWinner);

router.route('/random_jackpot_winner')
  .get(admin, jackpots.getJackpotWinner);

router.route('/history/random_jackpot')
  .get(jackpots.getRandomJackpotHistory);

router.route('/history/bet_amount_jackpot')
  .get(jackpots.getBetAmountJackpotHistory);

module.exports = router;
