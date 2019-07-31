const { NODE, NODE_TOKEN, GAME_RTP } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { dice } = require('@controllers/node');
const { calculateReward } = require('@utils/game');

const socket = io.connect(NODE, { reconnect: true });
let frontIO;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'blocks',
    token: NODE_TOKEN,
  });
});

const broadcastGame = async(index) => {
  const game = await db.bets.getByIndex({ index });
  frontIO.in('dice').emit('dice', { games: [game] });
};

const getGameResult = async(game, blockNumber, blockHash) => {
  const { wallet, params, bet, index, gameId } = game;
  const payload = await dice.getters.rng({ wallet, blockNumber, blockHash });

  const result = payload.result.result;
  await db.games.setFinish({ index, contractId: 0, result });

  const userId = await db.users.getId({ wallet });
  const prize = calculateReward(params, result, bet, GAME_RTP);
  await db.bets.setPrize({ gameId, userId, prize });

  broadcastGame(index);

  if (prize === 0) await db.bets.setConfirm({ userId, gameId });
  dice.functions.finishGame({ gameId: index });
};

const processBlocks = async(data) => {
  const { number, hash } = data;

  const games = await db.games.getByFinishBlock({ finishBlock: number });
  for (const game of games) getGameResult(game, number, hash);
};

socket.on('blocks', processBlocks);

module.exports = (io) => {
  frontIO = io;
};
