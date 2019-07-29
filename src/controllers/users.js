const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const getLevel = async(req, res) => {
  const { wallet } = req.query;

  const userId = await db.users.getId({ wallet });
  if (!userId) res.json(resSuccess({ wallet, level: 0 }));

  const userData = await db.users.get({ userId });
  if (!userData) return res.status(500).json(resError(73500));

  res.json(resSuccess({ userData }));
};

const getRefId = async(req, res) => {
  const { wallet } = req.query;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  let refId = await db.refs.get({ userId });
  if (!refId) refId = await db.refs.add({ userId });

  res.json(resSuccess({ refId }));
};

module.exports = {
  getLevel,
  getRefId,
};
