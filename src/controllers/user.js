const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const getLevel = async(req, res) => {
  const { wallet } = req.query;

  const level = await db.users.getLevel({ wallet }) || 0;

  res.json(resSuccess({ level }));
};

const totalBet = async(req, res) => {
  const { wallet } = req.query;

  const sum = await db.users.getBetSum({ wallet });
  if (sum === null) return res.status(500).json(resError(73500));

  res.json(resSuccess({ sum }));
};

const totalWin = async(req, res) => {
  const { wallet } = req.query;

  const sum = await db.users.getWinSum({ wallet });
  if (sum === null) return res.status(500).json(resError(73500));

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
  totalBet,
  totalWin,
  diceHistory,
  wheelHistory,
};
