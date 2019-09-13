const db = require('@db');
const { finish } = require('@controllers/node').dice.func;
const { diceRandom, diceReward } = require('@utils/game');

const finishGames = async(block) => {
  const games = await db.dice.getByFinishBlock({ finishBlock: block });
  if (games.length === 0) return;

  for (const game of games) {
    const { wallet, index, number, roll, bet } = game;

    game.result = await diceRandom(wallet, block);
    game.prize = diceReward(number, roll, game.result, bet);

    await db.dice.setFinish({ index, result: game.result, prize: game.prize });
    if (game.prize === 0) await db.dice.setConfirm({ index });

    finish({ index });
  }

  this.chanel.emit('dice-finish', { games });
};

module.exports = (node, chanel) => {
  node.on('blocks', finishGames);
  this.chanel = chanel;
};
