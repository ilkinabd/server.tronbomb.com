const { NODE, NODE_TOKEN } = process.env;

const axios = require('axios').create({
  baseURL: NODE,
  headers: {
    'maxie-token': NODE_TOKEN,
    'Content-type': 'application/json',
  }
});

const getRequest = (path) => async(params = {}) => {
  const res = await axios.get(path, { params }).catch(console.error);
  return (res) ? res.data : {};
};

const postRequest = (path) => async(params = {}) => {
  const res = await axios.post(NODE + path, params).catch(console.error);
  return (res) ? res.data : {};
};

module.exports = {
  portal: {
    get: {
      params: getRequest('/portal/get/params'),
    },
    func: {
      withdraw: postRequest('/portal/func/withdraw'),
    },
  },
  dice: {
    func: {
      rng: getRequest('/dice/func/rng'),
      finish: postRequest('/dice/func/finish_game'),
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
    portalBalance: getRequest('/tools/portal_balance'),
    totalMined: getRequest('/tools/total_mined'),
  },
  fund: {
    balance: getRequest('/fund/balance'),
    transfer: postRequest('/fund/transfer'),
    transferBOMB: postRequest('/fund/transfer_bomb'),
    mine: postRequest('/fund/mine'),
    freezeAll: postRequest('/fund/freeze_all'),
    withdrawDividends: postRequest('/fund/withdraw_dividends'),
  },
  bomb: {
    get: {
      balanceOf: getRequest('/bomb/get/balanceOf'),
    },
    func: {
      transfer: postRequest('/bomb/func/transfer'),
    }
  }
};
