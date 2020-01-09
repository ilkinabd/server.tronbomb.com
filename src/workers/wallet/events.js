const db = require('@db');

const chargeWallet = async data => {
  console.log('========= Charge wallet ===========');
  const { wallet, amount } = data;
  db.users.setBalance({ wallet: wallet, delta: amount });
};

const withdrawWallet = data => {
  console.log('========= Withdraw wallet ===========');
  const { wallet, amount } = data;
  db.users.setBalance({ wallet: wallet, delta: -amount });
};

module.exports = node => {
  node.on('charge-wallet', chargeWallet);
  node.on('withdraw-wallet', withdrawWallet);
};
