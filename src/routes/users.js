const express = require('express');
const router = new express.Router();

const controller = require('@controllers/users');
const validate = require('@middleware/validate');

router.route('/level')
  .get(validate('getLevel', true), controller.getLevel);

router.route('/ref/get_id')
  .get(validate('getRef', true), controller.getRefId);

router.route('/ref/add_id')
  .post(validate('addRef', false), controller.addRefId);

module.exports = router;
