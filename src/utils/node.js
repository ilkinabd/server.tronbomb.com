const { NODE, NODE_TOKEN } = process.env;

const axios = require('axios');

axios.defaults.headers['maxie-token'] = NODE_TOKEN;

const getRequest = (path) => async(params = {}) => {
  const response = await axios.get(NODE + path, { params });
  return response.data;
};

module.exports = {
  events: {
    takeBets: getRequest('/dice/events/take_bets'),
  },
};
