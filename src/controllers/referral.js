const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const getId = async(req, res) => {
  const { wallet } = req.query;

  let refId = await db.users.getRefId({ wallet });
  if (!refId) {
    await db.users.add({ wallet });
    refId = await db.users.getRefId({ wallet });
  }

  res.json(resSuccess({ refId }));
};

const setId = async(req, res) => {
  const { wallet, refId } = req.body;

  const userId = await db.users.getId({ wallet });
  if (!userId) await db.users.add({ wallet });

  await db.users.setRefId({ wallet, refId });

  res.json(resSuccess());
};

const walletById = async(req, res) => {
  const { refId } = req.query;

  const wallet = await db.refs.getWallet({ refId });
  if (!wallet) return res.status(422).json(resError(73407));

  res.json(resSuccess({ wallet }));
};

const setReferrer = async(req, res) => {
  const { wallet, refId } = req.body;

  const userId = await db.users.getId({ wallet });
  if (userId) return res.status(422).json(resError(73409));

  const referrer = await db.refs.getUserId({ refId });
  if (!referrer) return res.status(422).json(resError(73408));

  const id = await db.users.addReferrer({ wallet, referrer });
  if (!id) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

module.exports = {
  getId,
  setId,
  walletById,
  setReferrer,
};
