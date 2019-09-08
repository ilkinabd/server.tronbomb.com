const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bomb');

router.route('/burn_txs')
  .get(controller.getBurn);

router.route('/total_burn')
  .get(controller.getTotalBurn);

router.route('/total_mined')
  .get(controller.getTotalMined);

router.route('/history/freeze')
  .get(controller.getFreezeHistory);

router.route('/history/unfreeze')
  .get(controller.getUnfreezeHistory);

router.route('/total_freeze')
  .get(controller.totalFreeze);

router.route('/mining_level')
  .get(controller.miningLevel);

router.route('/buy_back_balance')
  .get(controller.getBuyBackBalance);

module.exports = router;
