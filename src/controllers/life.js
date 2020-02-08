const db = require('@db');

const buy = async (req, res) => {
  try {
    const { wallet, amount } = req.body;
    const { step } = await levelLife();
    db.life.add({
      wallet,
      amount,
      level: step,
      life: amount / step,
    });
    successRes(res);
  } catch (error) {
    errorRes(res, 500, 73500, error);
  }
};

module.exports = {
  buy,
};
