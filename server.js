const { NODE_URL, NODE_PORT } = process.env;

const http = require('http');

const app = require('./app');
const ws = require('./src/routes/ws');

const server = http.createServer(app);

const io = require('socket.io').listen(server);

io.on('connection', ws);

server.listen(NODE_PORT, NODE_URL, () => {
  console.info(`${NODE_URL}:${NODE_PORT}`);
});
