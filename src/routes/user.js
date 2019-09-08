const express = require('express');
const router = new express.Router();

const controller = require('@controllers/user');
const validate = require('@middleware/validate');

router.route('/level')
  .get(validate('wallet'), controller.getLevel);

router.route('/total_bet')
  .get(validate('wallet'), controller.totalBet);

router.route('/total_win')
  .get(validate('wallet'), controller.totalWin);

router.route('/total_mine')
  .get(validate('wallet'), controller.totalMine);

router.route('/total_freeze')
  .get(validate('wallet'), controller.totalFreeze);

router.route('/total_profit')
  .get(validate('wallet'), controller.totalProfit);

router.route('/awaiting_unfreeze')
  .get(validate('wallet'), controller.getAwaitingUnfreeze);

router.route('/history/dice')
  .get(validate('wallet'), controller.diceHistory);

router.route('/history/wheel')
  .get(validate('wallet'), controller.wheelHistory);

router.route('/history/freeze')
  .get(validate('wallet'), controller.getFreezeHistory);

router.route('/history/unfreeze')
  .get(validate('wallet'), controller.getUnfreezeHistory);

module.exports = router;
