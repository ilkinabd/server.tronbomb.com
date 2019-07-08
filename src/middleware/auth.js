const { ADMIN_TOKEN } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers['maxie-token'];

  if (!token) return res.status(401).json({
    auth: false,
    message: 'No token provided.'
  });

  if (token !== ADMIN_TOKEN) return res.status(403).json({
    auth: false,
    message: 'Wrong token'
  });

  next();
};
