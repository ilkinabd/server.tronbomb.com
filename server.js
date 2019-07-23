const { NODE_URL, NODE_PORT } = process.env;
require('module-alias/register');

const app = require('./app');
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const ws = require('@controllers/socket');
io.on('connection', (socket) => ws(socket, io));

require('@workers/dice-bets');
require('@workers/dice-finish')(io);
require('@workers/dice-win');

require('@workers/rating')(io);
require('@workers/ban');

server.listen(NODE_PORT, NODE_URL, () => {
  console.info(`${NODE_URL}:${NODE_PORT}`);
});
