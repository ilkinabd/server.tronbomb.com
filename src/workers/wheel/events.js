const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');
const { mining } = require('@utils/mining');
const { getSymbol, getIndex } = require('@utils/wheel');

const takePart = async(data) => {
  const { wallet, bet, tokenId, sector, finishBlock, index } = data;
  const symbol = getSymbol(tokenId);
  const game = getIndex(finishBlock);

  if (symbol === 'TRX') await mining(bet, wallet);
  await db.wheel.add({ index, finishBlock, wallet, bet, tokenId, sector });

  updateLevel(wallet);
  referrerProfit(wallet, index, bet, 'wheel');

  this.chanel.emit('wheel-bet', { index: game, wallet, bet, symbol, sector });
};

const reward = (data) => db.wheel.setConfirm({ index: data.index });

module.exports = (node, chanel) => {
  node.on('wheel-take-part', takePart);
  node.on('wheel-reward', reward);
  this.chanel = chanel;
};
