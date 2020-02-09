const db = require('@db');

const axios = require('axios').create({
  baseURL: 'https://apilist.tronscan.org/api',
  headers: {
    'Content-type': 'application/json',
  },
});
const { level: levelLife } = require('@utils/life');

const HOUR = 60 * 60 * 1000;
module.exports = () => {
  setInterval(async () => {
    const currentDate = new Date().getTime();
    const {
      data: { transfers },
    } = await axios.get('/trc10trc20-transfer', {
      params: {
        start_timestamp: currentDate - HOUR,
        end_timestamp: currentDate + HOUR,
        direction: 'in',
        address: 'TUYTqAL1ZsNcmg4Cf62nmCbz7LqengAGzj',
      },
    });

    console.log('Transfers : ')
    console.log(transfers);
    for (const transfer of transfers) {
      const { amount, owner_address: wallet, hash } = transfer;
      const { step: level } = await levelLife();
      const exists = await db.life.getByHash({ hash });
      if (!exists) {
        console.log('Adding transfer into database');
        db.life.add({
          wallet,
          amount: amount / 1e6,
          level,
          life: amount / 1e6 / level,
          hash,
        });
      }
    }
  }, 5000);
};
