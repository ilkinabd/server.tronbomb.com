const express = require('express');
const router = new express.Router();

const controller = require('@controllers/referral');
const validate = require('@middleware/validate');

router.route('/get_id')
  .get(validate('getUserData'), controller.getId);

router.route('/set_id')
  .post(validate('setRef', false), controller.setId);

router.route('/get_wallet')
  .get(validate('getWallet'), controller.getWallet);

router.route('/get_referrals')
  .get(validate('getUserData'), controller.getReferrals);

router.route('/get_referrer')
  .get(validate('getUserData'), controller.getReferrer);

router.route('/set_referrer')
  .post(validate('setRef', false), controller.setReferrer);

module.exports = router;
