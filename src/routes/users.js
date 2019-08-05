const express = require('express');
const router = new express.Router();

const controller = require('@controllers/users');
const validate = require('@middleware/validate');

router.route('/level')
  .get(validate('getUserData', true), controller.getLevel);

router.route('/statistics/total_bet_sum')
  .get(validate('getUserData', true), controller.betSum);

router.route('/statistics/total_win_sum')
  .get(validate('getUserData', true), controller.totalWin);

router.route('/history/dice')
  .get(validate('getUserData', true), controller.diceHistory);

router.route('/history/wheel')
  .get(validate('getUserData', true), controller.wheelHistory);

module.exports = router;
