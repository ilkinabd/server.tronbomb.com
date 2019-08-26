const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bomb');

router.route('/burn_txs')
  .get(controller.getBurn);

router.route('/frozen_txs')
  .get(controller.getFrozen);

router.route('/total_frozen')
  .get(controller.totalFrozen);

module.exports = router;
