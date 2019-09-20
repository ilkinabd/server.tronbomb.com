const { JACKPOTS, DIVIDENDS } = process.env;
const { ACTIVE, MIN_BET_SUM, MAX_FUND, DELAY } = JSON.parse(JACKPOTS);
const { ACTIVE: DIVIDENDS_ACTIVE } = JSON.parse(DIVIDENDS);

const db = require('@db');
const { portal, fund, tools } = require('@controllers/node');
const { level } = require('@utils/mining');
const { getIndex } = require('@utils/auction');
const getResponse = require('@utils/get-response');
const { leftToPayout, operatingProfit } = require('@utils/dividends');
const { successRes, errorRes } = require('@utils/res-builder');

const getConfigs = async(_req, res) => {
  const config = await tools.getContracts();
  if (config.status !== 'success') return errorRes(res, 500, 73500);

  const { contracts } = config;

  successRes(res, { contracts });
};

const miningLevel = async(_req, res) => {
  const params = await level();
  successRes(res, params);
};

const totalBetPrize = async(_req, res) => {
  const diceBetSum = await db.dice.getBetSum();
  const dicePrizeSum = await db.dice.getPrizeSum();
  const wheelBetSum = await db.wheel.getBetSum();
  const wheelPrizeSum = await db.wheel.getPrizeSum();

  const betSum = diceBetSum + wheelBetSum;
  const prizeSum = dicePrizeSum + wheelPrizeSum;

  successRes(res, { betSum, prizeSum });
};

const dividendsParams = async(_req, res) => {
  const active = DIVIDENDS_ACTIVE;
  const nextPayout = Date.now() + leftToPayout();
  const profit = await operatingProfit();
  const totalFrozen = await db.freeze.getSum();
  const totalMined = (await tools.totalMined()).totalMined;

  successRes(res, { active, nextPayout, profit, totalFrozen, totalMined });
};

const getJackpotParams = async(_req, res) => {
  let type = 'random-jackpot';
  const randomBalance = (await fund.balance({ type })).balanceTRX;
  type = 'bet-amount-jackpot';
  const betAmountBalance = (await fund.balance({ type })).balanceTRX;

  const nextPayout = Date.now() + leftToPayout() + DELAY;

  successRes(res, {
    active: ACTIVE,
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

const getAuctionParams = async(_req, res) => {
  const type = 'auction';
  const { balanceTRX } = await fund.balance({ type });
  const index = getIndex();
  successRes(res, { prizePool: balanceTRX, index });
};

const subscribe = async(req, res) => {
  const { mail } = req.body;
  const result = await getResponse(mail);
  if (!result) return errorRes(res, 500, 73500);

  const { status, code } = result;

  if (status === 202) successRes(res);

  switch (code) {
    case 1008:
      errorRes(res, 422, 73600);
      break;
    case 1000:
      errorRes(res, 422, 73601);
      break;
    case 1002:
      errorRes(res, 422, 73602);
      break;
    default:
      errorRes(res, 500, 73500);
      console.error(result);
      break;
  }
};

const getPortalParams = async(_req, res) => {
  const params = await portal.get.params();
  delete params.status;
  successRes(res, { params });
};

const getPortalStatus = async(_req, res) => {
  const { mainStatus } = await portal.get.params();
  successRes(res, { mainStatus });
};

const setPortalStatus = async(req, res) => {
  const { status } = req.body;
  const payload = await portal.set.mainStatus({ status });
  successRes(res, { result: payload.status });
};

module.exports = {
  getConfigs,
  miningLevel,
  totalBetPrize,
  dividendsParams,
  getJackpotParams,
  getRandomJackpotHistory,
  getBetAmountJackpotHistory,
  setJackpotWinner,
  getJackpotWinner,
  getAuctionParams,
  subscribe,
  getPortalParams,
  getPortalStatus,
  setPortalStatus,
};
