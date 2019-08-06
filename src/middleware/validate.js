const { MIN_WITHDRAW, MAX_WITHDRAW } = process.env;

const Joi = require('@hapi/joi');

const templates = {
  wallet: Joi.string().alphanum().length(34),
  refId: Joi.string().alphanum().uppercase({ force: true }).length(6),
  mail: Joi.string()
    .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
    .max(60),
};

const schemas = {
  addBan: Joi.object().keys({
    wallet: templates.wallet.required(),
    reason: Joi.string().required(),
    endTime: Joi.date().required(),
  }),
  getUserData: Joi.object().keys({
    wallet: templates.wallet.required(),
  }),
  setRef: Joi.object().keys({
    wallet: templates.wallet.required(),
    refId: templates.refId.required(),
  }),
  getWallet: Joi.object().keys({
    refId: templates.refId.required(),
  }),
  subscribe: Joi.object().keys({
    mail: templates.mail.required(),
  }),
  withdraw: Joi.object().keys({
    wallet: templates.wallet.required(),
    amount: Joi.number()
      .min(parseFloat(MIN_WITHDRAW)).max(parseFloat(MAX_WITHDRAW)).required(),
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
