const node = require('@controllers/node');

const { success: resSuccess } = require('@utils/res-builder');

const getConfigs = async(_req, res) => {
  const configs = await node.contracts.getAll();
  res.json(resSuccess({ configs }));
};

module.exports = {
  getConfigs,
};
