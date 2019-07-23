const express = require('express');
const router = new express.Router();

const controller = require('@controllers/users');
const auth = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/level')
  .get(auth, validate('getLevel', true), controller.getLevel);

module.exports = router;
