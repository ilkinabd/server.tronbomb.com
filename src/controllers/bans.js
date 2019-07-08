const db = require('@db');

const { success: resSuccess, error: resError } = require('@utils/res-builder');

const add = async(req, res) => {
  const { wallet, reason, endTime } = req.body;

  const userId = await db.users.getId({ wallet });
  if (!userId) return res.status(422).json(resError(73400));

  const id = await db.bans.add({ userId, reason, endTime });
  if (!id) return res.status(500).json(resError(73500));
  res.json(resSuccess());
};

module.exports = {
  add,
};
