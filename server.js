const { NODE, NODE_TOKEN, NODE_URL, NODE_PORT } = process.env;
require('module-alias/register');

const app = require('./app');
const server = require('http').createServer(app);
const serverIO = require('socket.io')(server);
const clientIO = require('socket.io-client');

const ws = require('@controllers/socket');
serverIO.on('connection', (socket) => ws(socket, serverIO));

const node = clientIO.connect(NODE, { reconnect: true });

node.on('connect', () => {
  const rooms = ['blocks', 'dice', 'wheel', 'operations', 'bomb'];
  for (const room of rooms) node.emit('subscribe', { room, token: NODE_TOKEN });
});

require('@workers/dice/events')(node);
require('@workers/dice/finish')(node, serverIO.in('dice'));

require('@workers/wheel/events')(node, serverIO.in('wheel'));
require('@workers/wheel/start-finish')(node, serverIO.in('wheel'));

require('@workers/rating')(serverIO.in('rating'));
require('@workers/operations')(node);
require('@workers/dividends')(node, serverIO);

require('@workers/bomb/burn');
require('@workers/bomb/freeze')(node);

require('@workers/auction/bets.js')(serverIO.in('auction'));

server.listen(NODE_PORT, NODE_URL, () => {
  console.info(`${NODE_URL}:${NODE_PORT}`);
});
