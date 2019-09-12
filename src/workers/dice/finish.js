const db = require('@db');
const { finish } = require('@controllers/node').dice.func;
const { getRandom, getReward } = require('@utils/dice');

const finishGames = async(block) => {
  const { number, hash } = block;
  const games = await db.dice.getByFinishBlock({ finishBlock: number });
  if (games.length === 0) return;

  for (const game of games) {
    const { wallet, index, number, roll, bet } = game;

    game.result = await getRandom(wallet, number, hash);
    game.prize = getReward(number, roll, game.result, bet);

    await db.dice.setFinish({ index, result: game.result, prize: game.prize });
    if (game.prize === 0) await db.dice.setConfirm({ index });

    finish({ index, hash });
  }

  this.chanel.emit('dice-finish', { games });
};

module.exports = (node, chanel) => {
  node.on('blocks', finishGames);
  this.chanel = chanel;
};
