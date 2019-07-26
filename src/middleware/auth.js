const { ADMIN_TOKEN } = process.env;

const { resError } = require('@utils/res-builder');

const admin = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) return res.status(401).json(resError(73430));
  if (token !== ADMIN_TOKEN) return res.status(403).json(resError(73431));

  next();
};

module.exports = {
  admin,
};
