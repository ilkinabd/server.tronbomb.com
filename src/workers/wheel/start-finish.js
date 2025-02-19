const { WHEEL_START_BLOCK, WHEEL_DURATION } = process.env;

const db = require('@db');
const { finish } = require('@controllers/node').wheel.func;
const { getSector, getCoef, getIndex, wheelRandom } = require('@utils/game');

const startBlock = parseInt(WHEEL_START_BLOCK);
const duration = parseInt(WHEEL_DURATION);

const rollbar = require('rollbar');

const finishBets = async(bets) => {
  for (const { index, finishBlock, bet, sector } of bets) {
    //todo: refactor this
    let random = null;
    try {
      random = await wheelRandom(finishBlock);
    } catch (e) {
      console.error(`finishBets\nfinishBlock: ${finishBlock} \nerror: ${e}`);
      rollbar(`finishBets\nfinishBlock: ${finishBlock} \nerror: ${e}`);
    }
    if (!random) continue;

    const result = getSector(random);
    const prize = (sector === result) ? bet * getCoef(result) : 0;

    await db.wheel.setFinish({ result, prize, index });
    if (prize === 0) await db.wheel.setConfirm({ index });
  }
};

const checkStart = (number) => {
  if ((number - startBlock) % duration !== 1) return;

  const index = getIndex(number);
  const finishBlock = (number - 1) + duration;
  this.chanel.emit('wheel-start', { index, finishBlock });
};

const checkStopBets = async(number) => {
  if ((number - startBlock) % duration !== duration - 5) return;
  const index = getIndex(number);
  this.chanel.emit('wheel-stop-bets', { index });
};

const checkFinish = async(number) => {
  if ((number - startBlock) % duration !== 0) return;

  const index = getIndex(number) - 1;
  const result = await wheelRandom(number);
  const sector = getSector(result);

  this.chanel.emit('wheel-finish', { index, result, sector });

  const bets = await db.wheel.getByStatus({
    status: 'start',
    currentBlock: number
  });
  if (bets.length === 0) return;

  finishBets(bets);
  finish();
};

const processBlocks = async(block) => {
  checkStart(block);
  checkStopBets(block);
  checkFinish(block);
};

module.exports = (node, chanel) => {
  node.on('blocks', processBlocks);
  this.chanel = chanel;
};
