const express = require('express');
const router = new express.Router();

const controller = require('@controllers/games');

router.route('/list').post(controller.getList);

router.route('/sync').post(controller.sync);

module.exports = router;
