const db = require('@db');

const { successRes, resSuccess, errorRes } = require('@utils/res-builder');

const getId = async(req, res) => {
  const { wallet } = req.query;
  const refId = await db.users.getRefId({ wallet });
  successRes(res, { refId });
};

const setId = async(req, res) => {
  const { wallet, refId } = req.body;

  const userId = await db.users.add({ wallet });
  const result = await db.users.setRefId({ userId, refId });
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

const getReferrer = async(req, res) => {
  const { wallet } = req.query;
  const referrer = await db.users.getReferrer({ wallet });
  successRes(res, { referrer });
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
  res.json(resSuccess({ profit }));
};

const getReferralPayments = async(req, res) => {
  const { wallet } = req.query;
  const payments = await db.refPayments.getByWallet({ wallet });
  res.json(resSuccess({ payments }));
};

const withdrawTxs = async(req, res) => {
  const { wallet } = req.query;
  const txs = await db.refWithdraws.getByWallet({ wallet });
  res.json(resSuccess({ txs }));
};

module.exports = {
  getId,
  setId,
  getWallet,
  getReferrals,
  getTotalReferrals,
  getReferrer,
  setReferrer,
  getProfit,
  getReferralPayments,
  withdrawTxs,
};
