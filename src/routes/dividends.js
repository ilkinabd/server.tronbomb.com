const express = require('express');
const router = new express.Router();

const controller = require('@controllers/dividends');
const validate = require('@middleware/validate');

router.route('/get_info')
  .get(validate('getUserData'), controller.dividendsInfo);

module.exports = router;
