const express = require('express');
const router = new express.Router();

const controller = require('@controllers/subscribe');
const validate = require('@middleware/validate');

router.route('/')
  .post(validate('subscribe', false), controller.subscribe);

module.exports = router;
