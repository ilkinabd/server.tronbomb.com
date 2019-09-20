const express = require('express');
const router = new express.Router();

const controller = require('@controllers/i18n');
const validate = require('@middleware/validate');

router.route('/languages')
  .get(controller.getLanguages);

router.route('/language')
  .get(validate('language'), controller.getLanguage);

module.exports = router;
