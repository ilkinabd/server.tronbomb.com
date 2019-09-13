const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');
const { mining } = require('@utils/mining');
const { getSymbol } = require('@utils/game');

const takePart = async(data) => {
  const { index, wallet, finishBlock, bet, tokenId, number, roll } = data;
  const symbol = getSymbol(tokenId);

  if (symbol === 'TRX') {
    mining(bet, wallet);
    referrerProfit(wallet, bet);
  }

  db.dice.add({ index, finishBlock, wallet, bet, symbol, number, roll });
  updateLevel(wallet);
};

const reward = (data) => db.dice.setConfirm({ index: data.index });

module.exports = (node) => {
  node.on('dice-take-part', takePart);
  node.on('dice-reward', reward);
};
