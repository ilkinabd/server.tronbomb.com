const node = require('@controllers/node');
const getResponse = require('@utils/get-response');
const { resSuccess, resError } = require('@utils/res-builder');

const getConfigs = async(_req, res) => {
  const config = await node.contracts.getAll();
  if (config.status !== 'success') return res.status(500).json(resError(73500));

  const { contracts } = config;

  res.json(resSuccess({ contracts }));
};

const subscribe = async(req, res) => {
  const { mail } = req.body;
  const result = await getResponse(mail);
  if (!result) return res.status(500).json(resError(73500));

  const { status, code } = result;

  if (status === 202) return res.json(resSuccess());

  switch (code) {
    case 1008:
      res.status(422).json(resError(73600));
      break;
    case 1000:
      res.status(422).json(resError(73601));
      break;
    case 1002:
      res.status(422).json(resError(73602));
      break;
    default:
      res.status(500).json(resError(73500));
      console.error(result);
      break;
  }
};

module.exports = {
  getConfigs,
  subscribe,
};
