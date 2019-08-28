const express = require('express');
const router = new express.Router();

const controller = require('@controllers/auction');

router.route('/fund')
  .get(controller.fund);

module.exports = router;
