const express = require('express');
const router = new express.Router();

const controller = require('@controllers/referral');
const validate = require('@middleware/validate');

router.route('/id')
  .get(validate('wallet'), controller.getId);

router.route('/set_id')
  .post(validate('setRef', false), controller.setId);

router.route('/wallet')
  .get(validate('refId'), controller.getWallet);

router.route('/referrals')
  .get(validate('wallet'), controller.getReferrals);

router.route('/total_referrals')
  .get(validate('wallet'), controller.getTotalReferrals);

router.route('/referrer')
  .get(validate('wallet'), controller.getReferrer);

router.route('/set_referrer')
  .post(validate('setRef', false), controller.setReferrer);

router.route('/profit')
  .get(validate('wallet'), controller.getProfit);

router.route('/get_referral_payments')
  .get(validate('wallet'), controller.getReferralPayments);

router.route('/withdraw_txs')
  .get(validate('wallet'), controller.withdrawTxs);

module.exports = router;
