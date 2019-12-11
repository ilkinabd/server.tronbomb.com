const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');
const { mining } = require('@utils/mining');
const { getIndex } = require('@utils/game');

const takePart = async(data) => {
  const { wallet, bet, isToken, sector, finishBlock, index } = data;
  const symbol = isToken ? 'BOMB' : 'TRX';
  const game = getIndex(finishBlock) - 1;

  if (symbol === 'TRX') {
    mining(bet, wallet);
    referrerProfit(wallet, bet);
  }

  db.wheel.add({ index, finishBlock, wallet, bet, symbol, sector });
  updateLevel(wallet);

  //todo: this is temporary solution, need remove bets, which amount 0
  if (bet > 0)
    this.chanel.emit('wheel-bet', { index: game, wallet, bet, symbol, sector });
};

const reward = (data) => db.wheel.setConfirm({ index: data.index });

module.exports = (node, chanel) => {
  node.on('wheel-take-part', takePart);
  node.on('wheel-reward', reward);
  this.chanel = chanel;
};
