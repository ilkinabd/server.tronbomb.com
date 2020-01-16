const express = require('express');
const router = new express.Router();

const controller = require('@controllers/games');

router.route('/games/list').post(controller.getList);

router.route('/games/sync').post(controller.sync);

module.exports = router;
