const { GET_RESPONSE_TOKEN, GET_RESPONSE_KEY } = process.env;

const axios = require('axios');

const { resSuccess } = require('@utils/res-builder');

const url = 'https://api.getresponse.com/v3/contacts';

const headers = {
  'Content-type': 'application/json',
  'X-Auth-Token': `api-key ${GET_RESPONSE_TOKEN}`,
};

const body = {
  campaign: {
    campaignId: GET_RESPONSE_KEY,
  }
};

const subscribe = async(req, res) => {
  const { mail } = req.body;

  body.email = mail;
  await axios.post(url, body, { headers });

  res.json(resSuccess());
};

module.exports = {
  subscribe,
};
