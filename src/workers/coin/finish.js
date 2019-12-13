const db = require("@db");
const { finish } = require("@controllers/node").coin.func;
const { coinRandom, coinReward } = require("@utils/game");

const finishGames = async block => {
  try {
    // Gets unfinished games by block
    const games = await db.coin.getByFinishBlock({ finishBlock: block });

    // If not have games break
    if (games.length === 0) return;

    // Loop over each unfinished game
    for (const game of games) {
      const { wallet, index, number, bet } = game;

      console.log(`Forecast is : ${number}`);
      
      // Do http request to node server get game result
      game.result = await coinRandom(wallet, block);
      console.log(`Game result is : ${game.result}`);

      // Calculate game prize
      game.prize = coinReward(number, game.result, bet);
      console.log(`Calculated prize is : ${game.prize}`);

      // Update game in DB by index
      await db.coin.setFinish({
        index,
        result: game.result,
        prize: game.prize
      });

      // If not winner set confirmed = true in DB
      if (game.prize === 0) await db.coin.setConfirm({ index });

      // Do http request to node server to finish game by index
      finish({ index });
    }

    // Emit finish event to client
    this.chanel.emit("coin-finish", { games });
    console.log('======== coin-finish emitted ========');
    console.log('Finished games are :');
    console.debug(games);
  } catch (err) {
    console.debug(err);
  }
};

const autoFinish = async () => {
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
  node.on("blocks", finishGames);
  this.chanel = chanel;

  setInterval(autoFinish, 120000);
};
