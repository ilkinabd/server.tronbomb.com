const express = require('express');
const router = new express.Router();

const controller = require('@controllers/games');

router
  .route('/games/list')
  .post(controller.getList);

module.exports = router;
