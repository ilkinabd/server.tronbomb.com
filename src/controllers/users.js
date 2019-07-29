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

const addRefId = async(req, res) => {
  const { wallet, refId } = req.body;

  let userId = await db.users.getId({ wallet });
  if (!userId) userId = await db.users.add({ wallet });

  const isExist = await db.refs.isExist({ refId });
  if (isExist) return res.status(422).json(resError(73406));

  await db.refs.addId({ userId, refId });

  res.json(resSuccess());
};

module.exports = {
  getLevel,
  getRefId,
  addRefId,
};
