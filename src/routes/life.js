const main = require('@controllers/life');
const express = require('express');
const router = new express.Router();

router.route('/buy').post(main.buy);

module.exports = router;
