const { NODE, NODE_TOKEN, WHEEL_START_BLOCK, WHEEL_DURATION } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const utils = require('@utils/wheel');
const { wheel, tools } = require('@controllers/node');

const startBlock = parseInt(WHEEL_START_BLOCK);
const gameDuration = parseInt(WHEEL_DURATION);

const socket = io.connect(NODE, { reconnect: true });
let chanel;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'blocks',
    token: NODE_TOKEN,
  });
});

const getRNGResult = async(block) => {
  const blockObject = await tools.getters.block({ id: block });
  if (!blockObject) return;

  const hash = `0x${blockObject.hash}`;
  const payload = await wheel.getters.rng({ block, hash });
  return payload.random;
};

const finishBet = async(payload) => {
  const { index, finishBlock, bet, sector } = payload;

  // Try to finish all bets (not only for this game)
  const result = await getRNGResult(finishBlock);
  if (!result) return;

  const winSector = utils.getSector(result);
  const coef = utils.getCoef(winSector);
  const prize = (sector === winSector) ? bet * coef : 0;

  await db.wheel.setFinish({ result, prize, index });
  if (prize === 0) await db.wheel.setConfirm({ index });
};

const checkStart = (number) => {
  if ((number - startBlock) % gameDuration !== 1) return;

  const index = Math.floor((number - startBlock) / gameDuration);
  const finishBlock = number + gameDuration;
  chanel.emit('start', { index, finishBlock });
};

const checkStopBets = async(number) => {
  if ((number - startBlock) % gameDuration !== gameDuration - 2) return;

  const index = Math.floor((number - startBlock) / gameDuration);
  chanel.emit('stop-bets', { index });
};

const checkFinish = async(number) => {
  if ((number - startBlock) % gameDuration !== 0) return;

  // Result for this game
  const index = Math.floor((number - startBlock) / gameDuration) - 1;
  const result = await getRNGResult(number);
  const sector = utils.getSector(result);

  chanel.emit('finish', { index, result, sector });

  const bets = await db.wheel.getByStatus({ status: 'start' });
  if (bets.length === 0) return;

  for (const bet of bets) finishBet(bet);
  wheel.functions.finish();
};

const processBlocks = async(data) => {
  const { number } = data;

  checkStart(number);
  checkStopBets(number);
  checkFinish(number);
};

socket.on('blocks', processBlocks);

module.exports = async(ioChanel) => {
  chanel = ioChanel;
};
