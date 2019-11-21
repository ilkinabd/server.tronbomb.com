const db = require('@db');
const { finish } = require('@controllers/node').coin.func;
const { coinRandom, coinReward } = require('@utils/game');

const finishGames = async(block) => {
  const games = await db.coin.getByFinishBlock({ finishBlock: block });
  if (games.length === 0) return;

  for (const game of games) {
    const { wallet, index, number, bet } = game;

    game.result = await coinRandom(wallet, block);
    game.prize = coinReward(number, game.result, bet);

    await db.coin.setFinish({ index, result: game.result, prize: game.prize });
    if (game.prize === 0) await db.coin.setConfirm({ index });

    finish({ index });
  }

  this.chanel.emit('coin-finish', { games });
};

const autoFinish = async() => {
  const games = await db.coin.getNonFinished();
  const indexes = [];

  if (games.length === 0) return;

  for (const game of games) {
    const { index, finishBlock, wallet, number, bet } = game;

    const result = await coinRandom(wallet, finishBlock);
    const prize = coinReward(number, result, bet);

    await db.coin.setFinish({ index, result, prize });
    if (prize === 0) await db.coin.setConfirm({ index });

    finish({ index });
    indexes.push(index);
  }

  console.info(`AutoFinish: ${indexes}.`);
};

module.exports = (node, chanel) => {
  node.on('blocks', finishGames);
  this.chanel = chanel;

  setInterval(autoFinish, 120000);
};
