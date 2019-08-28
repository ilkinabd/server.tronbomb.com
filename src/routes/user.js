const express = require('express');
const router = new express.Router();

const controller = require('@controllers/user');
const validate = require('@middleware/validate');

router.route('/level')
  .get(validate('getUserData'), controller.getLevel);

router.route('/total_bet')
  .get(validate('getUserData'), controller.totalBet);

router.route('/total_win')
  .get(validate('getUserData'), controller.totalWin);

router.route('/total_freeze')
  .get(validate('getUserData'), controller.totalFreeze);

router.route('/history/dice')
  .get(validate('getUserData'), controller.diceHistory);

router.route('/history/wheel')
  .get(validate('getUserData'), controller.wheelHistory);

router.route('/history/frozen')
  .get(validate('getUserData'), controller.frozenHistory);

module.exports = router;
