const express = require('express');
const router = new express.Router();

const controller = require('@controllers/users');
const validate = require('@middleware/validate');

router.route('/level')
  .get(validate('getUserData', true), controller.getLevel);

router.route('/ref/get_id')
  .get(validate('getUserData', true), controller.getRefId);

router.route('/ref/add_id')
  .post(validate('addRef', false), controller.addRefId);

router.route('/ref/wallet_by_id')
  .get(validate('getWallet', true), controller.walletById);

router.route('/ref/set_referrer')
  .post(validate('addRef', false), controller.setReferrer);

router.route('/statistics/total_bet_sum')
  .get(validate('getUserData', true), controller.betSum);

module.exports = router;
