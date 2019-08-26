const { NODE, NODE_TOKEN } = process.env;

const axios = require('axios');
const qs = require('querystring');

const getRequest = (path) => async(params = {}) => {
  const res = await axios.get(NODE + path, { params, headers: {
    'maxie-token': NODE_TOKEN,
  } }).catch(console.error);

  return (res) ? res.data : {};
};

const postRequest = (path) => async(params = {}) => {
  const res = await axios.post(NODE + path, qs.stringify(params), { headers: {
    'maxie-token': NODE_TOKEN,
    'Content-type': 'application/x-www-form-urlencoded',
  } }).catch(console.error);

  return (res) ? res.data : {};
};

module.exports = {
  dice: {
    func: {
      rng: getRequest('/dice/func/rng'),
      finishGame: postRequest('/dice/func/finish_game'),
    },
  },
  wheel: {
    func: {
      rng: getRequest('/wheel/func/rng'),
      finish: postRequest('/wheel/func/finish'),
    },
  },
  tools: {
    getBlock: getRequest('/tools/block'),
    getContracts: getRequest('/tools/contracts'),
    getFunds: getRequest('/tools/funds'),
  },
  fund: {
    transfer: postRequest('/fund/transfer'),
    transferBOMB: postRequest('/fund/transfer_bomb'),
  },
  bomb: {
    func: {
      transfer: postRequest('/bomb/func/transfer'),
    }
  }
};
