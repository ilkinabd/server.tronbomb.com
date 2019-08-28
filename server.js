const { NODE_URL, NODE_PORT } = process.env;
require('module-alias/register');

const app = require('./app');
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const ws = require('@controllers/socket');
io.on('connection', (socket) => ws(socket, io));

require('@workers/dice/events');
require('@workers/dice/finish')(io.in('dice'));

require('@workers/wheel/events')(io.in('wheel'));
require('@workers/wheel/start-finish')(io.in('wheel'));

require('@workers/rating')(io.in('rating'));
require('@workers/operations');
require('@workers/dividends');

require('@workers/bomb/burn');
require('@workers/bomb/freeze');

server.listen(NODE_PORT, NODE_URL, () => {
  console.info(`${NODE_URL}:${NODE_PORT}`);
});
