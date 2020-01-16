const db = require('@db');
const {
  IMPERIUM: { URL, HALL, KEY },
} = JSON.parse(process.env.PROVIDERS);
const { successRes, errorRes } = require('@utils/res-builder');

const axios = require('axios').create({
  baseURL: URL,
  headers: {
    'Content-type': 'application/json',
  },
});

// const getRequest = path => async (params = {}) => {
//   return await axios.get(URL + path, { params });
// };

// const postRequest = path => async (params = {}) => {
//   const res = await axios.post(URL + path, params).catch(console.error);
//   return res ? res.data : {};
// };

const getList = async (_req, res) => {
  try {
    const games = await db.games.getPopular();
    successRes(res, { games });
  } catch (error) {
    errorRes(res, 500, 73500, error);
  }
};

const sync = async (_req, res) => {
  try {
    const {
      data: {
        content: { gameList },
      },
    } = await axios.post('/', {
      cmd: 'gamesList',
      hall: HALL,
      key: KEY,
    });
    await db.games.truncate();
    for (let i = 0; i < gameList.length; i++) {
      const {
        id: externalId,
        name,
        img,
        device,
        title: label,
        flash: isFlash,
        vertical: isVertical,
      } = gameList[i];

      db.games
        .add({
          name,
          img,
          label,
          isFlash: +isFlash,
          device,
          isVertical: +isVertical,
          externalId,
        })
        .catch(console.error);
    }
    successRes(res);
  } catch (error) {
    errorRes(res, 500, 73500, error);
  }
};

module.exports = {
  getList,
  sync,
};
