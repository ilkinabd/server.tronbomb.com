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

const betSum = async(req, res) => {
  const { wallet } = req.query;

  const userId = await db.users.getId({ wallet });
  if (!userId) return res.status(422).json(resError(73400));

  const sum = await db.users.getBetSum({ userId });
  if (sum === undefined) return res.status(500).json(resError(73500));

  res.json(resSuccess({ sum }));
};

const totalWin = async(req, res) => {
  const { wallet } = req.query;

  const userId = await db.users.getId({ wallet });
  if (!userId) return res.status(422).json(resError(73400));

  const sum = await db.users.getWinSum({ userId });
  if (sum === undefined) return res.status(500).json(resError(73500));

  res.json(resSuccess({ sum }));
};

const diceHistory = async(req, res) => {
  const { wallet } = req.query;

  const games = await db.diceBets.getWalletHistory({ wallet });
  if (!games) return res.status(500).json(resError(73500));

  res.json(resSuccess({ games }));
};

const wheelHistory = async(req, res) => {
  const { wallet } = req.query;

  const games = await db.wheelBets.getWalletHistory({ wallet });
  if (!games) return res.status(500).json(resError(73500));

  res.json(resSuccess({ games }));
};

module.exports = {
  getLevel,
  getRefId,
  addRefId,
  walletById,
  setReferrer,
  betSum,
  totalWin,
  diceHistory,
  wheelHistory,
};
