const { NODE, NODE_TOKEN, GAME_RTP } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { dice } = require('@controllers/node');
const utils = require('@utils/dice');

const socket = io.connect(NODE, { reconnect: true });
let chanel;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'blocks',
    token: NODE_TOKEN,
  });
});

const getRNGResult = async(address, block, hash) => {
  const payload = await dice.getters.rng({ address, block, hash });
  return payload.random;
};

const setPrize = async(params, result, bet, index) => {
  const prize = utils.getReward(params, result, bet, GAME_RTP);
  await db.dice.setFinish({ index, result, prize });
  if (prize === 0) await db.dice.setConfirm({ index });

  return prize;
};

const broadcastGame = async(index) => {
  const game = await db.dice.getByIndex({ index });
  chanel.emit('dice', { games: [game] });
};

const getGameResult = async(game, block, hash) => {
  const { index, wallet, bet, number, roll } = game;
  const params = { number, roll };

  const result = await getRNGResult(wallet, block, hash);
  await setPrize(params, result, bet, index);

  dice.functions.finishGame({ id: index });
  broadcastGame(index);
};

const processBlocks = async(data) => {
  const { number, hash } = data;
  const games = await db.dice.getByFinishBlock({ finishBlock: number });
  for (const game of games) getGameResult(game, number, hash);
};

socket.on('blocks', processBlocks);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
