const db = require('@db');
const { updateLevel, referrerProfit } = require('@utils/users');
const { mining } = require('@utils/mining');
const rollbar = require('@utils/rollbar');

const takePart = async(data) => {
  const { index, wallet, finishBlock, bet, isToken, number, roll } = data;
  const symbol = isToken ? 'BOMB' : 'TRX';

  rollbar.info(`Receive takePart: ${JSON.stringify(data)}`);

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
