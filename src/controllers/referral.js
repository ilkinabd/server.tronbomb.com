const db = require('@db');

const { successRes, errorRes } = require('@utils/res-builder');

const getId = async(req, res) => {
  const { wallet } = req.query;
  await db.users.add({ wallet });
  const refId = await db.users.getRefId({ wallet });

  successRes(res, { refId });
};

const setId = async(req, res) => {
  const { wallet, refId } = req.body;
  const result = await db.users.setRefId({ wallet, refId });
  if (!result) return errorRes(res, 422, 73406);

  successRes(res);
};

const getWallet = async(req, res) => {
  const { refId } = req.query;
  const wallet = await db.users.getWalletByRefId({ refId });
  if (!wallet) return errorRes(res, 422, 73407);

  successRes(res, { wallet });
};

const getReferrals = async(req, res) => {
  const { wallet } = req.query;
  const referrals = await db.users.getReferrals({ wallet });
  successRes(res, { referrals });
};

const getTotalReferrals = async(req, res) => {
  const { wallet } = req.query;
  const count = await db.users.getReferralsCount({ wallet });
  successRes(res, { count });
};

const getReferrers = async(req, res) => {
  const { wallet } = req.query;
  const referrers = await db.users.getReferrers({ wallet });
  successRes(res, { referrers });
};

const setReferrer = async(req, res) => {
  const { wallet, refId } = req.body;

  const isExist = await db.users.isExist({ wallet });
  if (isExist) return errorRes(res, 422, 73409);

  const userId = await db.users.add({ wallet });
  const referrer = await db.users.getWalletByRefId({ refId });
  await db.users.setReferrer({ userId, referrer });

  successRes(res);
};

const getProfit = async(req, res) => {
  const { wallet } = req.query;
  const profit = await db.users.getRefProfit({ wallet });
  successRes(res, { profit });
};

const getIncome = async(req, res) => {
  const { wallet } = req.query;
  const type = 'income';
  const operations = await db.referrals.getTypeByWallet({ wallet, type });
  successRes(res, { operations });
};

const getWithdraw = async(req, res) => {
  const { wallet } = req.query;

  const type = 'withdraw';
  const operations = await db.referrals.getTypeByWallet({ wallet, type });
  for (const operation of operations) delete operation.referral;

  successRes(res, { operations });
};

module.exports = {
  getId,
  setId,
  getWallet,
  getReferrals,
  getTotalReferrals,
  getReferrers,
  setReferrer,
  getProfit,
  getIncome,
  getWithdraw,
};
