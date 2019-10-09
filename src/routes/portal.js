const express = require('express');
const router = new express.Router();

const main = require('@controllers/portal');
const jackpots = require('@controllers/portal/jackpots');
const { admin, recaptchaVerify } = require('@middleware/auth');
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
  .post(validate('adminLogin', false), recaptchaVerify, main.adminLogin);

// Jackpots

router.route('/jackpots/params')
  .get(jackpots.params);

router.route('/jackpots/set_random_winner')
  .post(admin, validate('jackpotWinner', false), jackpots.setWinner);

router.route('/jackpots/random_winner')
  .get(admin, jackpots.getWinner);

router.route('/jackpots/history/random')
  .get(jackpots.randomHistory);

router.route('/jackpots/history/bet_amount')
  .get(jackpots.betAmountHistory);

router.route('/jackpots/set_random_status')
  .post(admin, validate('status', false), jackpots.setRandomStatus);

router.route('/jackpots/set_bet_amount_status')
  .post(admin, validate('status', false), jackpots.setBetAmountStatus);

module.exports = router;
