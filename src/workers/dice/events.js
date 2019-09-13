const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');
const { mining } = require('@utils/mining');
const { getSymbol } = require('@utils/game');

const takePart = async(data) => {
  const { index, wallet, finishBlock, bet, tokenId, number, roll } = data;
  const symbol = getSymbol(tokenId);

  if (symbol === 'TRX') await mining(bet, wallet);
  await db.dice.add({ index, finishBlock, wallet, bet, symbol, number, roll });

  updateLevel(wallet);
  referrerProfit(wallet, index, bet, 'dice');
};

const reward = (data) => db.dice.setConfirm({ index: data.index });

module.exports = (node) => {
  node.on('dice-take-part', takePart);
  node.on('dice-reward', reward);
};
