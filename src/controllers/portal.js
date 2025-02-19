const { ADMIN_LOGIN, ADMIN_PASS, ADMIN_TOKEN, DIVIDENDS, LIFE } = process.env;
const { ACTIVE: DIVIDENDS_ACTIVE } = JSON.parse(DIVIDENDS);
const { ACTIVE: LIFE_ACTIVE } = JSON.parse(LIFE);

const db = require('@db');
const { portal, dice, fund, tools } = require('@controllers/node');
const { diceRandom, diceReward } = require('@utils/game');
const { level } = require('@utils/mining');
const { getIndex } = require('@utils/auction');
const getResponse = require('@utils/get-response');
const { leftToPayout, operatingProfit } = require('@utils/dividends');
const {
  leftToPayout: leftToPayoutLife,
  level: levelLife,
} = require('@utils/life');
const { successRes, errorRes } = require('@utils/res-builder');

const getConfigs = async (_req, res) => {
  const config = await tools.getContracts();
  if (config.status !== 'success') return errorRes(res, 500, 73500);

  const { contracts } = config;

  successRes(res, { contracts });
};

const miningLevel = async (_req, res) => {
  const params = await level();
  successRes(res, params);
};

const totalBetPrize = async (_req, res) => {
  const diceBetCount = await db.dice.getBetCount();
  const dicePrizeSum = await db.dice.getPrizeSum();
  const wheelBetCount = await db.wheel.getBetCount();
  const wheelPrizeSum = await db.wheel.getPrizeSum();

  const betSum = diceBetCount + wheelBetCount;
  const prizeSum = dicePrizeSum + wheelPrizeSum;

  successRes(res, { betSum, prizeSum });
};

const dividendsParams = async (_req, res) => {
  const active = DIVIDENDS_ACTIVE;
  const nextPayout = Date.now() + leftToPayout();
  const profit = await operatingProfit();
  const totalFrozen = await db.freeze.getSum();
  const totalMined = (await tools.totalMined()).totalMined;

  successRes(res, { active, nextPayout, profit, totalFrozen, totalMined });
};

const lifeParams = async (_req, res) => {
  const active = LIFE_ACTIVE;
  const nextPayout = Date.now() + leftToPayoutLife();
  const { step, level } = await levelLife();

  successRes(res, { active, nextPayout, step, level });
};

const getAuctionParams = async (_req, res) => {
  const type = 'auction';
  const { balanceTRX } = await fund.balance({ type });
  const index = getIndex();
  successRes(res, { prizePool: balanceTRX, index });
};

const subscribe = async (req, res) => {
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

const getPortalParams = async (_req, res) => {
  const params = await portal.get.params();
  delete params.status;
  successRes(res, { params });
};

const getPortalStatus = async (_req, res) => {
  const { mainStatus } = await portal.get.params();
  successRes(res, { mainStatus });
};

const setPortalStatus = async (req, res) => {
  const { status } = req.body;
  const payload = await portal.set.mainStatus({ status });
  successRes(res, { result: payload.status });
};

const adminLogin = async (req, res) => {
  const { login, pass } = req.body;
  if (login !== ADMIN_LOGIN) return errorRes(res, 401, 73413);
  if (pass !== ADMIN_PASS) return errorRes(res, 401, 73413);
  successRes(res, { token: ADMIN_TOKEN });
};

const finishDice = async (_req, res) => {
  const games = await db.dice.getNonFinished();
  const indexes = [];

  if (games.length === 0) return successRes(res, { indexes });

  for (const game of games) {
    const { index, finishBlock, wallet, number, roll, bet } = game;

    const result = await diceRandom(wallet, finishBlock);
    const prize = diceReward(number, roll, result, bet);

    await db.dice.setFinish({ index, result, prize });
    if (prize === 0) await db.dice.setConfirm({ index });

    dice.func.finish({ index });
    indexes.push(index);
  }

  successRes(res, { indexes });
};

module.exports = {
  getConfigs,
  miningLevel,
  totalBetPrize,
  dividendsParams,
  getAuctionParams,
  subscribe,
  getPortalParams,
  getPortalStatus,
  setPortalStatus,
  adminLogin,
  finishDice,
  lifeParams,
};
