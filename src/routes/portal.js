const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');

router.route('/configs')
  .get(controller.getConfigs);

module.exports = router;
