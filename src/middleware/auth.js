const { ADMIN_TOKEN } = process.env;

const { errorRes } = require('@utils/res-builder');

const admin = (req, res, next) => {
  const token = req.headers['maxie-token'];
  if (!token) return errorRes(res, 401, 73404);
  if (token !== ADMIN_TOKEN) return errorRes(res, 403, 73405);

  next();
};

module.exports = {
  admin,
};
