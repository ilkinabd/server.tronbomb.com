const db = require('@db');

const { successRes, resSuccess, resError } = require('@utils/res-builder');

const getId = async(req, res) => {
  const { wallet } = req.query;
  const refId = await db.users.getRefId({ wallet });
  successRes(res, { refId });
};

const setId = async(req, res) => {
  const { wallet, refId } = req.body;

  const userId = await db.users.getId({ wallet });
  if (!userId) await db.users.add({ wallet });

  const result = await db.users.setRefId({ wallet, refId });
  if (!result) return res.status(422).json(resError(73406));

  res.json(resSuccess());
};

const getWallet = async(req, res) => {
  const { refId } = req.query;

  const wallet = await db.users.getWalletByRefId({ refId });
  if (!wallet) return res.status(422).json(resError(73407));

  res.json(resSuccess({ wallet }));
};

const getReferrals = async(req, res) => {
  const { wallet } = req.query;
  const referrals = await db.refPayments.getGroupByWallet({ wallet });
  res.json(resSuccess({ referrals }));
};

const getReferralsCount = async(req, res) => {
  const { wallet } = req.query;
  const count = await db.users.getReferralsCount({ wallet });
  res.json(resSuccess({ count }));
};

const getReferrer = async(req, res) => {
  const { wallet } = req.query;
  const referrer = await db.users.getReferrer({ wallet });
  res.json(resSuccess({ referrer }));
};

const setReferrer = async(req, res) => {
  const { wallet, refId } = req.body;

  const userId = await db.users.getId({ wallet });
  if (userId) return res.status(422).json(resError(73409));

  const referrer = await db.users.getWalletByRefId({ refId });
  if (referrer === wallet) return res.status(422).json(resError(73411));

  const id = await db.users.add({ wallet, referrer });
  if (!id) return res.status(500).json(resError(73500));

  res.json(resSuccess());
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
  getReferralsCount,
  getReferrer,
  setReferrer,
  getProfit,
  getReferralPayments,
  withdrawTxs,
};
