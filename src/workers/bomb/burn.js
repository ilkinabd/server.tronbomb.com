const db = require('@db');

const burn = async(data) => {
  const { amount, from, hash } = data;
  await db.burn.add({ amount, from, hash });
};

module.exports = (node) => {
  node.on('bomb-burn', burn);
};
