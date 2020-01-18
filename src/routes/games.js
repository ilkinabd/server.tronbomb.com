const express = require('express');
const router = new express.Router();
const multer = require('multer');

const controller = require('@controllers/games');

router.route('/api').post(multer.none(), controller.apiCallback);

router.route('/list').post(controller.getList);

router.route('/sync').post(controller.sync);

module.exports = router;
