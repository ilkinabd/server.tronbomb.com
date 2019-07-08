const { NODE_URL, NODE_PORT } = process.env;
require('module-alias/register');

const app = require('./app');
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const ws = require('@controllers/socket');
io.on('connection', ws);

require('@workers/new-bets');
require('@workers/finish-games');
require('@workers/players-win');

require('@workers/rating')(io);

server.listen(NODE_PORT, NODE_URL, () => {
  console.info(`${NODE_URL}:${NODE_PORT}`);
});
