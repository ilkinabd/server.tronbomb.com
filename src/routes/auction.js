const express = require('express');
const router = new express.Router();

const controller = require('@controllers/auction');

router.route('/current_bet').get(controller.getCurrentBet);

module.exports = router;
