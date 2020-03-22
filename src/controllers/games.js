const db = require('@db');
const {
  IMPERIUM: { URL, HALL, KEY },
} = JSON.parse(process.env.PROVIDERS);
const { successRes, errorRes } = require('@utils/res-builder');
const { updateLevel, referrerProfit } = require('@utils/users');
const { mining } = require('@utils/mining');

const axios = require('axios').create({
  baseURL: URL,
  headers: {
    'Content-type': 'application/json',
  },
});

const getList = async (req, res) => {
  try {
    const { cat } = req.body;
    let games = [];
    switch (cat) {
      case 'popular':
        games = await db.games.getPopular();
        break;
      case 'table':
        games = await db.games.getTable();
        break;
    }
    successRes(res, { games });
  } catch (error) {
    errorRes(res, 500, 73500, error);
  }
};

const openGame = async (req, res) => {
  try {
    const { wallet, gameId } = req.body;
    const {
      data: {
        status,
        error,
        content: { game },
      },
    } = await axios.post('/openGame/', {
      cmd: 'openGame',
      hall: HALL,
      key: KEY,
      login: wallet,
      gameId: gameId,
      demo: '0',
      continent: 'eur',
      domain: 'devserver.tronbomb.com',
      language: 'en',
    });
    if (status === 'fail') throw new Error(error);
    const dbGame = await db.games.getById({ externalId: gameId });
    const gameRes = Object.assign(dbGame, game);
    successRes(res, { game: gameRes });
  } catch (error) {
    console.error(error);
    errorRes(res, 500, 73500, error);
  }
};

const apiCallback = async (req, res) => {
  try {
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
      const userId = await db.users.getId({ wallet: login });
      db.bets.add({
        userId: userId,
        bet: bet,
        prize: parseFloat(bet) + winLose > 0 ? parseFloat(bet) + winLose : 0,
      });
      mining(bet, login);
      referrerProfit(login, bet);
      await db.users.setBalance({ wallet: login, delta: winLose });
      const newBalance = await db.users.getBalance({ wallet: login });
      updateLevel(login);
      console.log(
        `Balance : ${balance} | Bet : ${bet} | WinLose : ${winLose} | New balance : ${newBalance}`,
      );
      res.json({
        status: 'success',
        error: '',
        login: login,
        balance: newBalance.toFixed(2),
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
  openGame,
};
