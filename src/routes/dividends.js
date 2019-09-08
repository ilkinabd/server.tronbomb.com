const express = require('express');
const router = new express.Router();

const controller = require('@controllers/dividends');
const validate = require('@middleware/validate');

router.route('/info')
  .get(validate('wallet'), controller.info);

router.route('/history')
  .get(controller.history);

module.exports = router;
