const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const getLevel = async(req, res) => {
  const { wallet } = req.query;

  const userId = await db.users.getId({ wallet });
  if (!userId) res.json(resSuccess({ wallet, level: 0 }));

  const useerData = await db.users.get({ userId });
  if (!useerData) return res.status(500).json(resError(73500));

  res.json(resSuccess(useerData));
};

module.exports = {
  getLevel,
};
