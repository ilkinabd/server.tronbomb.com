const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bomb');

router.route('/burn_txs')
  .get(controller.getBurn);

module.exports = router;
