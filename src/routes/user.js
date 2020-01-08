const express = require('express');
const router = new express.Router();

const controller = require('@controllers/user');
const validate = require('@middleware/validate');

router.route('/level').get(validate('wallet'), controller.getLevel);

router.route('/total_bet').get(validate('wallet'), controller.totalBet);

router.route('/total_win').get(validate('wallet'), controller.totalWin);

router.route('/total_mine').get(validate('wallet'), controller.totalMine);

router.route('/total_freeze').get(validate('wallet'), controller.totalFreeze);

router.route('/get_bets').get(controller.getBets);

router
  .route('/get_local_balance')
  .get(validate('wallet'), controller.getLocalBalance);

router
  .route('/get_bets_by_wallet')
  .get(validate('wallet'), controller.getBetsByWallet);

router
  .route('/total_dividends')
  .get(validate('wallet'), controller.totalDividends);

router
  .route('/awaiting_unfreeze')
  .get(validate('wallet'), controller.getAwaitingUnfreeze);

router
  .route('/awaiting_dividends')
  .get(validate('wallet'), controller.getAwaitingDividends);

router.route('/history/dice').get(validate('wallet'), controller.diceHistory);

router.route('/history/coin').get(validate('wallet'), controller.coinHistory);

router.route('/history/wheel').get(validate('wallet'), controller.wheelHistory);

router
  .route('/history/freeze')
  .get(validate('wallet'), controller.getFreezeHistory);

router
  .route('/history/unfreeze')
  .get(validate('wallet'), controller.getUnfreezeHistory);

router
  .route('/history/dividends')
  .get(validate('wallet'), controller.getDividendsHistory);

router
  .route('/history/bets')
  .get(validate('wallet'), controller.getBetsHistory);

module.exports = router;
