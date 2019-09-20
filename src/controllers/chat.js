// const { CHAT_USER_LEVEL } = process.env;

const db = require('@db');

const {
  successRes, resSuccess, errorRes, resError
} = require('@utils/res-builder');

const redirect = async(req, res) => successRes(res, req.user);

const send = async(req, res) => {
  const { data } = req.body;
  const { index, name } = req.user;
  if (!index) return errorRes(res, 401, 73411);

  const time = await db.chat.add({ index, data });
  process.serverIO.emit('chat', { messages: [{ data, time, name }] });
  successRes(res);
};

const getBanStatus = async(req, res) => {
  const { wallet } = req.query;

  const ban = await db.bans.get({ wallet });
  if (!ban.status) return res.json(resSuccess({ status: false }));

  res.json(resSuccess({ ban }));
};

const addBan = async(req, res) => {
  const { wallet, reason, endTime } = req.body;

  const id = await db.bans.add({ wallet, reason, endTime });
  if (!id) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

module.exports = {
  redirect,
  send,
  addBan,
  getBanStatus,
};
