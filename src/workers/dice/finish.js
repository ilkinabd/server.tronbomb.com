const { NODE, NODE_TOKEN, GAME_RTP } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { dice } = require('@controllers/node');
const utils = require('@utils/dice');

const socket = io.connect(NODE, { reconnect: true });
let sockets;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'blocks',
    token: NODE_TOKEN,
  });
});

const getRNGResult = async(wallet, blockNumber, blockHash) => {
  const payload = await dice.getters.rng({ wallet, blockNumber, blockHash });
  return payload.result.result;
};

const setPrize = async(params, result, bet, gameId) => {
  const prize = utils.getReward(params, result, bet, GAME_RTP);
  await db.diceBets.setPrize({ gameId, prize });
  if (prize === 0) await db.diceBets.setConfirm({ gameId });

  return prize;
};

const broadcastGame = async(index) => {
  const game = await db.dice.getByIndex({ index });
  sockets.in('dice').emit('dice', { games: [game] });
};

const getGameResult = async(game, block, hash) => {
  const { gameId, index, wallet, bet, number, roll } = game;
  const params = { number, roll };

  const result = await getRNGResult(wallet, block, hash);
  await db.dice.setFinish({ index, result });

  await setPrize(params, result, bet, gameId);

  broadcastGame(index);

  dice.functions.finishGame({ gameId: index });
};

const processBlocks = async(data) => {
  const { number, hash } = data;
  const games = await db.dice.getByFinishBlock({ finishBlock: number });
  for (const game of games) getGameResult(game, number, hash);
};

socket.on('blocks', processBlocks);

module.exports = (io) => {
  sockets = io;
};
