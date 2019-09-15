const { BUY_BACK_WALLET } = process.env;

const db = require('@db');
const { tools, bomb } = require('@controllers/node');
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
  const sum = (await tools.totalMined()).totalMined;
  successRes(res, { sum });
};

const getFreezeHistory = async(_req, res) => {
  const type = 'freeze';
  const operations = await db.freeze.getByTypeLimit({ type, limit: 100 });
  successRes(res, { operations });
};

const getUnfreezeHistory = async(_req, res) => {
  const type = 'unfreeze';
  const operations = await db.freeze.getByTypeLimit({ type, limit: 100 });
  successRes(res, { operations });
};

const totalFreeze = async(_req, res) => {
  const sum = await db.freeze.getSum();
  successRes(res, { sum });
};

const getBuyBackBalance = async(_req, res) => {
  const address = BUY_BACK_WALLET;
  const balance = (await bomb.get.balanceOf({ address })).amount;
  successRes(res, { address, balance });
};

const getDividendsHistory = async(_req, res) => {
  const operations = await db.dividends.getByLimit({ limit: 100 });
  successRes(res, { operations });
};

module.exports = {
  getBurn,
  getTotalBurn,
  getTotalMined,
  getFreezeHistory,
  getUnfreezeHistory,
  totalFreeze,
  getBuyBackBalance,
  getDividendsHistory,
};
