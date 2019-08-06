const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const utils = require('@utils/wheel');
const { wheel } = require('@controllers/node');

const socket = io.connect(NODE, { reconnect: true });
let chanel;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'blocks',
    token: NODE_TOKEN,
  });
});

const checkStopBet = async(number) => {
  const finishBlock = number + 2;
  const index = await db.wheel.getIndexByBlock({ finishBlock });
  if (index) chanel.emit('stop-bets', { index });
};

const getRNGResult = async(block, hash) => {
  const payload = await wheel.getters.rng({ block, hash });
  return payload.random;
};

const setPrizes = async(gameId, sector) => {
  const bets = await db.wheelBets.getByGame({ gameId });
  const coef = utils.getCoef(sector);

  for (const bet of bets) {
    const { sector: betSector, bet: betAmount, index } = bet;
    const prize = (betSector === sector) ? betAmount * coef : 0;

    await db.wheelBets.setPrize({ gameId, index, prize });
    if (prize === 0) await db.wheelBets.setConfirm({ gameId, index });
  }
};

const getGameResult = async(game, block, hash) => {
  const { gameId, index } = game;

  const result = await getRNGResult(block, hash);
  const sector = utils.getSector(result);
  await db.wheel.setFinish({ index, result });

  setPrizes(gameId, sector);

  wheel.functions.finish({ id: index });

  const initRes = wheel.functions.init();
  if (!initRes) setTimeout(() => wheel.functions.init(), 1000);

  chanel.emit('finish', { index, result, sector });
};

const processBlocks = async(data) => {
  const { number, hash } = data;
  checkStopBet(number);

  const games = await db.wheel.getByFinishBlock({ finishBlock: number });
  for (const game of games) getGameResult(game, number, hash);
};

socket.on('blocks', processBlocks);

module.exports = async(ioChanel) => {
  chanel = ioChanel;

  const lastGame = await db.wheel.getLastGame();
  const { status, index } = lastGame;

  if (status === 'start') await db.wheel.setFinish({ index, result: null });

  const initRes = wheel.functions.init();
  if (!initRes) setTimeout(() => wheel.functions.init(), 1000);
};
