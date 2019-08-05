const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const getLevel = async(req, res) => {
  const { wallet } = req.query;

  const userData = await db.users.get({ wallet });
  if (!userData) res.json(resSuccess({ wallet, level: 1 }));

  res.json(resSuccess({ userData }));
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
  betSum,
  totalWin,
  diceHistory,
  wheelHistory,
};
