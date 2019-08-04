const { CHAT_USER_LEVEL } = process.env;

const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const addBan = async(req, res) => {
  const { wallet, reason, endTime } = req.body;

  const id = await db.bans.add({ wallet, reason, endTime });
  if (!id) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

const newMessage = async(data, socket, chanel) => {
  const { msg, wallet } = data;

  if (!msg || !wallet) return socket.emit('fail', resError(73401));

  const user = await db.users.get({ wallet });
  if (user.level < CHAT_USER_LEVEL) return socket.emit('fail', resError(73403));

  const ban = await db.bans.get({ wallet });
  if (ban.status) return socket.emit('fail', resError(73402, ban));

  const time = await db.messages.add({ data: JSON.stringify(msg), wallet });
  chanel.emit('chat', { messages: [{ data: msg, time, wallet }] });
};

module.exports = {
  addBan,
  newMessage,
};
