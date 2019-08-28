const db = require('@db');
const node = require('@controllers/node');
const getResponse = require('@utils/get-response');
const { successRes, errorRes } = require('@utils/res-builder');

const getConfigs = async(_req, res) => {
  const config = await node.tools.getContracts();
  if (config.status !== 'success') return errorRes(res, 500, 73500);

  const { contracts } = config;

  successRes(res, { contracts });
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

module.exports = {
  getConfigs,
  totalBetPrize,
  subscribe,
};
