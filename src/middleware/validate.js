const { PLACES } = JSON.parse(process.env.JACKPOTS);

const Joi = require('@hapi/joi');

const templates = {
  place: Joi.number().integer().min(1).max(PLACES),
  index: Joi.string().regex(/[0-9]+/).length(21),
  wallet: Joi.string().alphanum().length(34),
  refId: Joi.string().alphanum().uppercase({ force: true }).length(6),
  'access_token': Joi.string(),
  mail: Joi.string()
    .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
    .max(60),
};

const schemas = {
  wallet: Joi.object().keys({
    wallet: templates.wallet.required(),
  }),
  refId: Joi.object().keys({
    refId: templates.refId.required(),
  }),
  jackpotWinner: Joi.object().keys({
    wallet: templates.wallet.required(),
    place: templates.place.required(),
  }),
  mail: Joi.object().keys({
    mail: templates.mail.required(),
  }),
  oauth: Joi.object().keys({
    'access_token': templates['access_token'].required(),
  }),
  msg: Joi.object().keys({
    'access_token': templates['access_token'].required(),
    data: Joi.object().required(),
  }),
  setBan: Joi.object().keys({
    'access_token': templates['access_token'].required(),
    index: templates.index.required(),
    reason: Joi.string().required(),
    endTime: Joi.date().required(),
  }),
  setRef: Joi.object().keys({
    wallet: templates.wallet.required(),
    refId: templates.refId.required(),
  }),
};

const validate = (type, isQuery = true) => (req, res, next) => {
  const schema = schemas[type];
  const data = (isQuery) ? req.query : req.body;

  const { error } = Joi.validate(data, schema);

  if (error) return res.status(422).json({
    status: 'error',
    message: error.details,
  });

  next();
};

module.exports = validate;
