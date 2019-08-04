const { GET_RESPONSE_TOKEN, GET_RESPONSE_KEY } = process.env;

const axios = require('axios');

const url = 'https://api.getresponse.com/v3/contacts';

const headers = {
  'Content-type': 'application/json',
  'X-Auth-Token': `api-key ${GET_RESPONSE_TOKEN}`,
};

const body = {
  campaign: {
    campaignId: GET_RESPONSE_KEY,
  },
};

module.exports = async(mail) => {
  body.email = mail;
  const result = await axios.post(url, body, { headers }).catch(console.error);
  return result;
};
