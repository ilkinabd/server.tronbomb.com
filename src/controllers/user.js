const { UNFREEZE_DELAY } = process.env;

const db = require('@db');
const { resSuccess, successRes } = require('@utils/res-builder');

const delay = parseInt(UNFREEZE_DELAY);

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

const totalDividends = async(req, res) => {
  const { wallet } = req.query;
  const sum = await db.dividends.getUserSum({ wallet });
  successRes(res, { sum });
};

const getAwaitingUnfreeze = async(req, res) => {
  const { wallet } = req.query;
  const { time, amount } = await db.freeze.getAwaitingByWallet({ wallet });
  if (!time) return successRes(res);

  const timeLeft = new Date(time).getTime() + delay - Date.now();

  successRes(res, { time, timeLeft, amount });
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

const getFreezeHistory = async(req, res) => {
  const { wallet } = req.query;
  const type = 'freeze';
  const operations = await db.freeze.getByWallet({ type, wallet });
  successRes(res, { operations });
};

const getUnfreezeHistory = async(req, res) => {
  const { wallet } = req.query;
  const type = 'unfreeze';
  const operations = await db.freeze.getByWallet({ type, wallet });
  successRes(res, { operations });
};

const getDividendsHistory = async(req, res) => {
  const { wallet } = req.query;
  const operations = await db.dividends.getByWallet({ wallet });
  successRes(res, { operations });
};

module.exports = {
  getLevel,
  totalBet,
  totalWin,
  totalMine,
  totalFreeze,
  totalDividends,
  getAwaitingUnfreeze,
  diceHistory,
  wheelHistory,
  getFreezeHistory,
  getUnfreezeHistory,
  getDividendsHistory,
};
