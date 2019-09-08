const db = require('@db');
const { level } = require('@utils/mining');
const { totalMined } = require('@controllers/node').tools;
const { successRes } = require('@utils/res-builder');

const getBurn = async(_req, res) => {
  const operations = await db.burn.getByLimit({ limit: 100 });
  successRes(res, { operations });
};

const getTotalBurn = async(_req, res) => {
  const sum = await db.burn.getSum();
  successRes(res, { sum });
};

const getTotalMined = async(_req, res) => {
  const sum = (await totalMined()).totalMined;
  successRes(res, { sum });
};

const getFrozen = async(_req, res) => {
  const operations = await db.freeze.getByLimit({ limit: 100 });
  successRes(res, { operations });
};

const totalFrozen = async(_req, res) => {
  const sum = await db.freeze.getSum();
  successRes(res, { sum });
};

const miningLevel = async(_req, res) => {
  const params = await level();
  successRes(res, params);
};

module.exports = {
  getBurn,
  getTotalBurn,
  getTotalMined,
  getFrozen,
  totalFrozen,
  miningLevel,
};
