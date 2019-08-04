const express = require('express');
const router = new express.Router();

const controller = require('@controllers/chat');
const { admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/add')
  .post(admin, validate('addBan', false), controller.addBan);

module.exports = router;
