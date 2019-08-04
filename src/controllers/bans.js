const db = require('@db');

const { resSuccess, resError } = require('@utils/res-builder');

const add = async(req, res) => {
  const { wallet, reason, endTime } = req.body;

  const id = await db.bans.add({ wallet, reason, endTime });
  if (!id) return res.status(500).json(resError(73500));

  res.json(resSuccess());
};

module.exports = {
  add,
};
