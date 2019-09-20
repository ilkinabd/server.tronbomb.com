const { NODE, NODE_TOKEN, NODE_PORT, AUCTION, DIVIDENDS } = process.env;
const { ACTIVE: DIVIDENDS_ACTIVE } = JSON.parse(DIVIDENDS);
const { ACTIVE: AUCTION_ACTIVE } = JSON.parse(AUCTION);
require('module-alias/register');

const app = require('./app');
const server = require('http').createServer(app);
const serverIO = require('socket.io')(server);
const clientIO = require('socket.io-client');

const ws = require('@controllers/socket');
serverIO.on('connection', ws);
process.frontWS = serverIO;

const node = clientIO.connect(NODE, { reconnect: true });

node.on('connect', () => {
  const rooms = ['blocks', 'dice', 'wheel', 'operations', 'bomb', 'auction'];
  for (const room of rooms) node.emit('subscribe', { room, token: NODE_TOKEN });
});

require('@workers/dice/events')(node);
require('@workers/dice/finish')(node, serverIO.in('dice'));

require('@workers/wheel/events')(node, serverIO.in('wheel'));
require('@workers/wheel/start-finish')(node, serverIO.in('wheel'));

require('@workers/rating')(serverIO.in('rating'));
require('@workers/operations')(node);
require('@workers/bomb/burn');
require('@workers/bomb/freeze')(node);

if (DIVIDENDS_ACTIVE)
  require('@workers/dividends')(node, serverIO);
if (AUCTION_ACTIVE)
  require('@workers/auction/bets.js')(node, serverIO.in('auction'));

server.listen(NODE_PORT, 'localhost', () => {
  console.info(`localhost:${NODE_PORT}`);
});
