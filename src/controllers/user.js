const db = require('@db');

const { resSuccess } = require('@utils/res-builder');

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

const diceHistory = async(req, res) => {
  const { wallet } = req.query;
  const games = await db.dice.getByWallet({ wallet });
  res.json(resSuccess({ games }));
};

const wheelHistory = async(req, res) => {
  const { wallet } = req.query;
  const games = await db.wheelBets.getAllByWallet({ wallet });
  res.json(resSuccess({ games }));
};

module.exports = {
  getLevel,
  totalBet,
  totalWin,
  diceHistory,
  wheelHistory,
};
