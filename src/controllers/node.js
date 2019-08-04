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
  contracts: {
    getAll: getRequest('/contracts/get_all'),
  },
  dice: {
    getters: {
      game: getRequest('/dice/get/game'),
      rng: getRequest('/dice/get/rng'),
    },
    functions: {
      finishGame: postRequest('/dice/func/finish_game'),
    },
    events: {
      takeBets: getRequest('/dice/events/take_bets'),
      finishGames: getRequest('/dice/events/finish_games'),
      playersWin: getRequest('/dice/events/players_win'),
    },
  },
  wheel: {
    getters: {
      rng: getRequest('/wheel/get/rng'),
    },
    functions: {
      init: postRequest('/wheel/func/init'),
      finish: postRequest('/wheel/func/finish'),
    },
  },
};
