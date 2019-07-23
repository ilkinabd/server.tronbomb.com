const { NODE, NODE_TOKEN } = process.env;

const axios = require('axios');
const qs = require('querystring');

const contentType = 'application/x-www-form-urlencoded';

axios.defaults.headers['maxie-token'] = NODE_TOKEN;
axios.defaults.headers.post['Content-type'] = contentType;

const getRequest = (path) => async(params = {}) => {
  const response = await axios.get(NODE + path, { params });
  return response.data;
};

const postRequest = (path) => async(params = {}) => {
  const response = await axios.post(NODE + path, qs.stringify(params));
  return response.data;
};

module.exports = {
  dice: {
    getters: {
      game: getRequest('/dice/get/game'),
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
};
