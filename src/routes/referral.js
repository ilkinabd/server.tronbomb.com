const express = require('express');
const router = new express.Router();

const controller = require('@controllers/referral');
const validate = require('@middleware/validate');

router.route('/get_id')
  .get(validate('getUserData', true), controller.getRefId);

router.route('/add_id')
  .post(validate('addRef', false), controller.addRefId);

router.route('/wallet_by_id')
  .get(validate('getWallet', true), controller.walletById);

router.route('/set_referrer')
  .post(validate('addRef', false), controller.setReferrer);

module.exports = router;
