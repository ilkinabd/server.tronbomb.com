const db = require('@db');

const { successRes } = require('@utils/res-builder');

const getBurn = async(_req, res) => {
  const operations = await db.burn.getByLimit({ limit: 100 });
  successRes(res, { operations });
};

const getFrozen = async(_req, res) => {
  const operations = await db.freeze.getByLimit({ limit: 100 });
  successRes(res, { operations });
};

const totalFrozen = async(_req, res) => {
  const sum = await db.freeze.getSum();
  successRes(res, { sum });
};

module.exports = {
  getBurn,
  getFrozen,
  totalFrozen,
};
