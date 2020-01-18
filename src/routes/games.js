const express = require('express');
const router = new express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const controller = require('@controllers/games');

router.route('/api').post(multipartMiddleware, controller.apiCallback);

router.route('/list').post(controller.getList);

router.route('/sync').post(controller.sync);

router.route('/open').post(controller.openGame);


module.exports = router;
