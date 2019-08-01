const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const utils = require('@controllers/wheel');
const { wheel } = require('@controllers/node');

const socket = io.connect(NODE, { reconnect: true });
let sockets;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'blocks',
    token: NODE_TOKEN,
  });
});

const checkStopBet = async(number) => {
  const finishBlock = number + 2;
  const index = await db.wheel.getIndexByBlock({ finishBlock });
  if (index) sockets.in('wheel').emit('stop-bets', { index });
};

const getRNGResult = async(blockNumber, blockHash) => {
  const payload = await wheel.getters.rng({ blockNumber, blockHash });
  return payload.result.result;
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

  sockets.in('wheel').emit('finish', { index, result, sector });
  wheel.functions.finish({ gameId: index });
  wheel.functions.init();
};

const processBlocks = async(data) => {
  const { number, hash } = data;
  checkStopBet(number);

  const games = await db.wheel.getByFinishBlock({ finishBlock: number });
  for (const game of games) getGameResult(game, number, hash);
};

socket.on('blocks', processBlocks);

// Init new game
setTimeout(() => {
  wheel.functions.init();
}, 1000);

module.exports = (io) => {
  sockets = io;
};
