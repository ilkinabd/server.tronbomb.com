const { NODE, NODE_TOKEN } = process.env;

const io = require('socket.io-client');

const db = require('@db');
const node = require('@controllers/node');
const { currentAuctionNumber, expectedPrize } = require('@utils/auction');

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
    await db.auction.add({ wallet, bet, auctionNumber });

    const bets = await db.auction.getByLimit({ auctionNumber, limit: 10 });
    const topBets = await expectedPrize(bets);

    chanel.emit('auction-bet', topBets);
  } else {
    const type = 'auction';
    node.fund.transferBOMB({ to: wallet, amount: bet, type });
  }
};

socket.on('auction-bet', auctionBet);

module.exports = (ioChanel) => {
  chanel = ioChanel;
};
