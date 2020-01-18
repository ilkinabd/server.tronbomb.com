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

const apiCallback = async (req, res) => {
  try {
    console.debug(req.body);
    const { cmd } = req.body;
    if (cmd === 'getBalance') {
      const { login } = req.body;
      const balance = await db.users.getBalance({ wallet: login });
      if (balance === null) {
        throw new Error('user_not_found');
      }
      res.json({
        status: 'success',
        error: '',
        login: login,
        balance: balance.toFixed(2),
        currency: 'RUB',
      });
    } else if (cmd === 'writeBet') {
      const { bet, winLose, login } = req.body;
      const balance = await db.users.getBalance({ wallet: login });
      if (bet > balance) {
        throw new Error('fail_balance');
      }
      const newbalance = balance + winLose;
      console.log(
        `Balance = ${balance}\nBet = ${bet}\nNew balance = ${newbalance}`,
      );
      await db.users.setBalance({ wallet: login, delta: winLose });
      res.json({
        status: 'success',
        error: '',
        login: login,
        balance: balance.toFixed(2),
        currency: 'RUB',
        operationId: Date.now(),
      });
    } else {
      throw new Error('cmd_not_found');
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: 'fail',
      error: error.message,
    });
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
  apiCallback,
};
