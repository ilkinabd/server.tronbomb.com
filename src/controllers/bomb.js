const db = require('@db');
const { level } = require('@utils/mining');
const node = require('@controllers/node');
const { successRes } = require('@utils/res-builder');

const getBurn = async(_req, res) => {
  const operations = await db.burn.getByLimit({ limit: 100 });
  successRes(res, { operations });
};

const totalMined = async(_req, res) => {
  const sum = (await node.tools.totalMined()).totalMined;
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
  totalMined,
  getFrozen,
  totalFrozen,
  miningLevel,
};
