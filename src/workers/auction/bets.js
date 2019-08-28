const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const { currentAuctionNumber } = require('@utils/auction');

const socket = io.connect(NODE, { reconnect: true });
let chanel;

socket.on('connect', () => {
  socket.emit('subscribe', {
    room: 'wheel',
    token: NODE_TOKEN,
  });
});

const auctionBet = async(data) => {
  const { bet, wallet } = data;
  const auctionNumber = currentAuctionNumber();

  const time = await db.auction.add({ wallet, bet, auctionNumber });

  chanel.emit('auction-bet', { time, bet, wallet, auctionNumber });
};

socket.on('auction-bet', auctionBet);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
