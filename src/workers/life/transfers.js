const db = require('@db');

const axios = require('axios').create({
  baseURL: 'https://apilist.tronscan.org/api',
  headers: {
    'Content-type': 'application/json',
  },
});

const HOUR = 60 * 60 * 1000;
module.exports = () => {
  setInterval(async () => {
    const currentDate = new Date().getTime();
    const transfers = await axios.get('/trc10trc20-transfer', {
      params: {
        start_timestamp: currentDate - HOUR,
        end_timestamp: currentDate + HOUR,
        direction: 'in',
        address: 'TUYTqAL1ZsNcmg4Cf62nmCbz7LqengAGzj',
      },
    });
    console.log('Transfers : ');
    console.debug(transfers);
  }, 5000);
};
