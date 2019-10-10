const { ADMINS } = JSON.parse(process.env.CHAT);

const db = require('@db');
const { successRes, errorRes } = require('@utils/res-builder');
const { getUserFromToken } = require('@utils/users');
const user = async(req, res) => successRes(res, req.user);

const tuser = async(req, res) => {
  const token = req.body['access_token'];
  const user = getUserFromToken(token);
  await db.oauthUsers.add(user);
  user.admin = ADMINS.includes(user.index);
  req.user = user;
  successRes(res, req.user);
};

const send = async(req, res) => {
  const { data } = req.body;
  const { index, name } = req.user;

  const { reason, endTime } = await db.bans.get({ index });
  if (reason) return errorRes(res, 401, 73402, { reason, endTime });
  const id = await db.chat.add({ index, data });
  const admin = ADMINS.includes(index);

  const messages = [{ id, index, name, data, time: new Date(), admin }];
  process.ws.emit('chat', { messages });

  successRes(res);
};

const tsend = async(req, res) => {
  const token = req.body['access_token'];
  req.user = getUserFromToken(token);
  const { data } = req.body;
  const { index, name } = req.user;

  const { reason, endTime } = await db.bans.get({ index });
  if (reason) return errorRes(res, 401, 73402, { reason, endTime });
  const id = await db.chat.add({ index, data });
  const admin = ADMINS.includes(index);

  const messages = [{ id, index, name, data, time: new Date(), admin }];
  process.ws.emit('chat', { messages });

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
  tuser,
  tsend
};
