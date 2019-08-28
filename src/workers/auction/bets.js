const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const socket = io.connect(NODE, { reconnect: true });
let chanel;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'wheel',
    token: NODE_TOKEN,
  });
});

const auctionBet = (data) => {
  const { amount, wallet } = data;
  console.log(amount, wallet);
};

socket.on('auction-bet', auctionBet);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
