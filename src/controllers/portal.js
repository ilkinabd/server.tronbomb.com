const node = require('@controllers/node');

const { resSuccess, resError } = require('@utils/res-builder');

const getConfigs = async(_req, res) => {
  const config = await node.contracts.getAll();
  if (config.status !== 'success') return res.status(500).json(resError(73500));

  const { contracts } = config;

  res.json(resSuccess({ contracts }));
};

module.exports = {
  getConfigs,
};
