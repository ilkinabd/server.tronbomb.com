const { MIN_BET_SUM, DELAY } = JSON.parse(process.env.JACKPOTS);

const db = require('@db');
const { leftToPayout } = require('@utils/dividends');
const { getFund } = require('@utils/jackpots');
const { successRes, errorRes } = require('@utils/res-builder');

const params = async(_req, res) => {
  successRes(res, {
    randomStatus: await db.configs.get({ key: 'RANDOM_JACKPOT_STATUS' }),
    betAmountStatus: await db.configs.get({ key: 'BET_AMOUNT_JACKPOT_STATUS' }),
    minBetSum: MIN_BET_SUM,
    randomFund: await getFund('random-jackpot'),
    betAmountFund: await getFund('bet-amount-jackpot'),
    nextPayout: Date.now() + leftToPayout() + DELAY,
  });
};

const randomHistory = async(_req, res) => {
  const payments = await db.jackpots.getByType({ type: 'random' });
  successRes(res, { payments });
};

const betAmountHistory = async(_req, res) => {
  const payments = await db.jackpots.getByType({ type: 'bet_amount' });
  successRes(res, { payments });
};

// Only for random jackpot
const setWinner = async(req, res) => {
  const { wallet, place } = req.body;

  const id = await db.jackpots.add({
    wallet,
    type: 'random',
    place,
    prize: null,
    status: false,
  });
  if (!id) return errorRes(res, 500, 73500);

  successRes(res);
};

const setRandomStatus = async(req, res) => {
  const { status } = req.body;
  await db.configs.set({ key: 'RANDOM_JACKPOT_STATUS', value: status });
  successRes(res);
};

const setBetAmountStatus = async(req, res) => {
  const { status } = req.body;
  await db.configs.set({ key: 'BET_AMOUNT_JACKPOT_STATUS', value: status });
  successRes(res);
};

const getWinner = async(_req, res) => {
  const winners = await db.jackpots.getRandomUnconfirmed();
  successRes(res, { winners });
};

module.exports = {
  params,
  randomHistory,
  betAmountHistory,
  setWinner,
  getWinner,
  setRandomStatus,
  setBetAmountStatus,
};
