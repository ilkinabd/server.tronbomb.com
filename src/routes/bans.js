const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bans');
const { admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/add')
  .post(admin, validate('addBan', false), controller.add);

module.exports = router;
