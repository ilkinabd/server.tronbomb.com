const { RANDOM_ACTIVE, BET_AMOUNT_ACTIVE } = JSON.parse(process.env.JACKPOTS);
const { MIN_BET_SUM, MAX_FUND, DELAY } = JSON.parse(process.env.JACKPOTS);

const db = require('@db');
const { fund } = require('@controllers/node');
const { leftToPayout } = require('@utils/dividends');
const { successRes, errorRes } = require('@utils/res-builder');

const getJackpotParams = async(_req, res) => {
  let type = 'random-jackpot';
  const randomBalance = (await fund.balance({ type })).balanceTRX;
  type = 'bet-amount-jackpot';
  const betAmountBalance = (await fund.balance({ type })).balanceTRX;

  const nextPayout = Date.now() + leftToPayout() + DELAY;

  successRes(res, {
    randomActive: RANDOM_ACTIVE,
    betAmountActive: BET_AMOUNT_ACTIVE,
    minBetSum: MIN_BET_SUM,
    randomFund: Math.min(randomBalance, MAX_FUND),
    betAmountFund: Math.min(betAmountBalance, MAX_FUND),
    nextPayout,
  });
};

const getRandomJackpotHistory = async(_req, res) => {
  const type = 'random';
  const payments = await db.jackpots.getByType({ type });
  successRes(res, { payments });
};

const getBetAmountJackpotHistory = async(_req, res) => {
  const type = 'bet_amount';
  const payments = await db.jackpots.getByType({ type });
  successRes(res, { payments });
};

// Only for random jackpot
const setJackpotWinner = async(req, res) => {
  const { wallet, place } = req.body;

  const type = 'random';
  const prize = null;
  const status = false;
  const id = await db.jackpots.add({ wallet, type, place, prize, status });
  if (!id) return errorRes(res, 500, 73500);

  successRes(res);
};

const getJackpotWinner = async(_req, res) => {
  const winners = await db.jackpots.getRandomUnconfirmed();
  successRes(res, { winners });
};

module.exports = {
  getJackpotParams,
  getRandomJackpotHistory,
  getBetAmountJackpotHistory,
  setJackpotWinner,
  getJackpotWinner,
};
