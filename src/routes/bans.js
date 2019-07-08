const express = require('express');
const router = new express.Router();

const controller = require('@controllers/bans');
const auth = require('@middleware/auth');
const validate = require('@middleware/validate');

router.route('/add')
  .post(auth, validate('addBan', false), controller.add);

module.exports = router;
