const db = require('@db');

const { resSuccess, successRes } = require('@utils/res-builder');

const getLevel = async(req, res) => {
  const { wallet } = req.query;
  const level = await db.users.getLevel({ wallet }) || 0;
  res.json(resSuccess({ level }));
};

const totalBet = async(req, res) => {
  const { wallet } = req.query;
  const sum = await db.users.getBetSum({ wallet });
  res.json(resSuccess({ sum }));
};

const totalWin = async(req, res) => {
  const { wallet } = req.query;
  const sum = await db.users.getWinSum({ wallet });
  res.json(resSuccess({ sum }));
};

const totalMine = async(req, res) => {
  const { wallet } = req.query;
  const sum = await db.mining.getUserSum({ wallet });
  res.json(resSuccess({ sum }));
};

const totalFreeze = async(req, res) => {
  const { wallet } = req.query;
  const sum = await db.freeze.getUserSum({ wallet });
  successRes(res, { sum });
};

const totalProfit = async(req, res) => {
  const { wallet } = req.query;
  const sum = await db.dividends.getUserSum({ wallet });
  successRes(res, { sum });
};

const diceHistory = async(req, res) => {
  const { wallet } = req.query;
  const games = await db.dice.getByWallet({ wallet });
  res.json(resSuccess({ games }));
};

const wheelHistory = async(req, res) => {
  const { wallet } = req.query;
  const games = await db.wheel.getByWallet({ wallet });
  res.json(resSuccess({ games }));
};

const frozenHistory = async(req, res) => {
  const { wallet } = req.query;
  const operations = await db.freeze.getByWallet({ wallet });
  successRes(res, { operations });
};

module.exports = {
  getLevel,
  totalBet,
  totalWin,
  totalMine,
  totalFreeze,
  totalProfit,
  diceHistory,
  wheelHistory,
  frozenHistory,
};
