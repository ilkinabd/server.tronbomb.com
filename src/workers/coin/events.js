const db = require("@db");
const { updateLevel, referrerProfit } = require("@utils/users");
const { mining } = require("@utils/mining");
const { getSymbol } = require("@utils/game");

const takePart = async data => {
  const { index, wallet, finishBlock, bet, tokenId, number } = data;
  const symbol = getSymbol(tokenId);

  if (symbol === "TRX") {
    mining(bet, wallet);
    referrerProfit(wallet, bet);
  }

  db.coin.add({ index, finishBlock, wallet, bet, symbol, number });
  updateLevel(wallet);
};

const reward = data => db.coin.setConfirm({ index: data.index });

module.exports = node => {
  node.on("coin-take-part", takePart);
  node.on("coin-reward", reward);
};
