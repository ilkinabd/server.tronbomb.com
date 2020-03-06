const db = require('@db');

const chargeWallet = async data => {
  const { wallet, amount } = data;
  console.log(`Charge event | ${wallet} | ${amount}`);
  db.users.add({ wallet });
  db.users.setBalance({ wallet: wallet, delta: amount });
};

const withdrawWallet = data => {
  const { wallet, amount } = data;
  console.log(`Withdraw event | ${wallet} | ${amount}`);
};

module.exports = node => {
  node.on('charge-wallet', chargeWallet);
  node.on('withdraw-wallet', withdrawWallet);
};
