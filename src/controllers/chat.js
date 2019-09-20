const db = require('@db');
const { successRes, errorRes } = require('@utils/res-builder');

const user = async(req, res) => successRes(res, req.user);

const send = async(req, res) => {
  const { data } = req.body;
  const { index, name } = req.user;

  const { reason, endTime } = await db.bans.get({ index });
  if (reason) return errorRes(res, 401, 73402, { reason, endTime });

  const time = await db.chat.add({ index, data });
  process.serverIO.emit('chat', { messages: [{ data, time, name, index }] });
  successRes(res);
};

const setBan = async(req, res) => {
  const { index, reason, endTime } = req.body;
  if (!req.user.admin) return errorRes(res, 401, 73411);

  const id = await db.bans.add({ index, reason, endTime });
  if (!id) return errorRes(res, 500, 73500);

  successRes(res);
};

module.exports = {
  user,
  send,
  setBan,
};
