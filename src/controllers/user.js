const { DELAY } = JSON.parse(process.env.FREEZE);

const db = require('@db');
const { operatingProfit, round } = require('@utils/dividends');
const { resSuccess, successRes } = require('@utils/res-builder');
const csvWriter = require('csv-write-stream');

const getLevel = async (req, res) => {
  const { wallet } = req.query;
  const level = (await db.users.getLevel({ wallet })) || 0;
  res.json(resSuccess({ level }));
};

const totalBet = async (req, res) => {
  const { wallet } = req.query;
  const sum = await db.users.getBetSum({ wallet });
  res.json(resSuccess({ sum }));
};

const totalWin = async (req, res) => {
  const { wallet } = req.query;
  const sum = await db.users.getWinSum({ wallet });
  res.json(resSuccess({ sum }));
};

const totalMine = async (req, res) => {
  const { wallet } = req.query;
  const sum = await db.users.getMine({ wallet });
  successRes(res, { sum });
};

const totalFreeze = async (req, res) => {
  const { wallet } = req.query;
  const sum = await db.freeze.getUserSum({ wallet });
  successRes(res, { sum });
};

const totalDividends = async (req, res) => {
  const { wallet } = req.query;
  const sum = await db.dividends.getUserSum({ wallet });
  successRes(res, { sum });
};

const getAwaitingUnfreeze = async (req, res) => {
  const { wallet } = req.query;

  const { time, amount } = await db.freeze.getAwaitingByWallet({ wallet });
  if (!time) return successRes(res);
  const timeLeft = new Date(time).getTime() - Date.now() + DELAY;

  successRes(res, { time, timeLeft, amount });
};

const getAwaitingDividends = async (req, res) => {
  const { wallet } = req.query;

  const profit = await operatingProfit();
  const totalFrozen = await db.freeze.getSum();
  const userFrozen = await db.freeze.getUserSum({ wallet });
  const amount = round(profit * (userFrozen / totalFrozen));

  successRes(res, { amount });
};

const diceHistory = async (req, res) => {
  const { wallet } = req.query;
  const games = await db.dice.getByWallet({ wallet });
  successRes(res, { games });
};

const coinHistory = async (req, res) => {
  const { wallet } = req.query;
  const games = await db.coin.getByWallet({ wallet });
  successRes(res, { games });
};

const wheelHistory = async (req, res) => {
  const { wallet } = req.query;
  const bets = await db.wheel.getByWallet({ wallet });
  successRes(res, { bets });
};

const getFreezeHistory = async (req, res) => {
  const { wallet } = req.query;
  const type = 'freeze';
  const operations = await db.freeze.getByWallet({ type, wallet });
  successRes(res, { operations });
};

const getUnfreezeHistory = async (req, res) => {
  const { wallet } = req.query;
  const type = 'unfreeze';
  const operations = await db.freeze.getByWallet({ type, wallet });
  successRes(res, { operations });
};

const getDividendsHistory = async (req, res) => {
  const { wallet } = req.query;
  const operations = await db.dividends.getByWallet({ wallet });
  successRes(res, { operations });
};

const getBetsByWallet = async (req, res) => {
  const { wallet } = req.query;
  const operations = await db.users.getAllBetsByWallet({
    limit: 25,
    wallet: wallet,
  });
  successRes(res, { operations });
};

const getBetsHistory = async (req, res) => {
  const { wallet } = req.query;
  const filename = 'bets.txt';
  const diceBets = await db.dice.getByWallet({ wallet });
  const wheelBets = await db.wheel.getByWallet({ wallet });
  const mimetype = 'text/plain';
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  const writer = csvWriter();
  writer.pipe(res);

  for (let i = 0; i < wheelBets.length; i++) {
    const { bet, sector, result, prize, time } = wheelBets[i];
    writer.write({
      game: 'wheel',
      bet,
      number: sector,
      result,
      prize,
      date: time,
    });
  }

  for (let i = 0; i < diceBets.length; i++) {
    const { bet, number, result, prize, time } = diceBets[i];
    writer.write({
      game: 'dice',
      bet,
      number,
      result,
      prize,
      date: time,
    });
  }

  writer.end();
};

module.exports = {
  getLevel,
  totalBet,
  totalWin,
  totalMine,
  totalFreeze,
  totalDividends,
  getAwaitingUnfreeze,
  getAwaitingDividends,
  diceHistory,
  coinHistory,
  wheelHistory,
  getFreezeHistory,
  getUnfreezeHistory,
  getDividendsHistory,
  getBetsHistory,
  getBetsByWallet,
};
