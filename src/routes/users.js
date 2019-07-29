const express = require('express');
const router = new express.Router();

const controller = require('@controllers/users');
const validate = require('@middleware/validate');

router.route('/level')
  .get(validate('getLevel', true), controller.getLevel);

router.route('/ref/get_id')
  .get(validate('getRef', true), controller.getRefId);

module.exports = router;
