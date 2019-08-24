const { NODE, NODE_TOKEN, WHEEL_START_BLOCK, WHEEL_DURATION } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { getSector, getCoef } = require('@utils/wheel');
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
  const blockData = await tools.getBlock({ index: block });
  if (!blockData) return;

  const { hash } = blockData;
  const payload = await wheel.func.rng({ block, hash });
  return payload.result;
};

const finishBet = async(payload) => {
  const { index, finishBlock, bet, sector } = payload;

  // Try to finish all bets (not only for this game)
  const result = await getRNGResult(finishBlock);
  if (!result) return;

  const winSector = getSector(result);
  const coef = getCoef(winSector);
  const prize = (sector === winSector) ? bet * coef : 0;

  await db.wheel.setFinish({ result: winSector, prize, index });
  if (prize === 0) await db.wheel.setConfirm({ index });
};

const checkStart = (number) => {
  if ((number - startBlock) % gameDuration !== 1) return;

  const index = Math.floor((number - startBlock) / gameDuration);
  const finishBlock = number + gameDuration;
  chanel.emit('wheel-start', { index, finishBlock });
};

const checkStopBets = async(number) => {
  if ((number - startBlock) % gameDuration !== gameDuration - 2) return;

  const index = Math.floor((number - startBlock) / gameDuration);
  chanel.emit('wheel-stop-bets', { index });
};

const checkFinish = async(number) => {
  if ((number - startBlock) % gameDuration !== 0) return;

  // Result for this game
  const index = Math.floor((number - startBlock) / gameDuration) - 1;
  const result = await getRNGResult(number);
  const sector = getSector(result);

  chanel.emit('wheel-finish', { index, result, sector });

  const bets = await db.wheel.getByStatus({ status: 'start' });
  if (bets.length === 0) return;

  for (const bet of bets) finishBet(bet);
  wheel.func.finish();
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
