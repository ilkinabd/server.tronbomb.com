const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const node = require('@controllers/node');
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

  const maxBet = await db.auction.getMaxBet({ auctionNumber });
  if (bet >= maxBet + 1) {
    const time = await db.auction.add({ wallet, bet, auctionNumber });
    chanel.emit('auction-bet', { time, bet, wallet, auctionNumber });
  } else {
    const type = 'auction';
    node.fund.transferBOMB({ to: wallet, amount: bet, type });
  }
};

socket.on('auction-bet', auctionBet);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
