const db = require('@db');
const { newMessage } = require('@controllers/chat');
const wheelUtils = require('@utils/wheel');

db.sockets.clear();

const joinRating = async(socket) => {
  const rating = await db.users.getTop({ limit: 100 });
  socket.emit('rating', { rating });
};
const joinChat = async(socket) => {
  const messages = await db.messages.getByLimit({ limit: 50 });
  socket.emit('chat', { messages });
};
const joinDice = async(socket) => {
  const games = await db.dice.getByLimit({ limit: 25 });
  socket.emit('dice', { games });
};
const joinWheel = async(socket) => {
  const games = await db.wheel.getByLimit({ limit: 25 });

  for (const game of games) {
    game.sector = wheelUtils.getSector(game.result);
  }

  socket.emit('wheel', { games });
};

const joinRoom = (room, socket) => {
  socket.join(room);

  switch (room) {
    case 'rating': joinRating(socket); break;
    case 'chat': joinChat(socket); break;
    case 'dice': joinDice(socket); break;
    case 'wheel': joinWheel(socket); break;
  }
};

const connected = (socket) => {
  const { id, adapter } = socket;
  const rooms = Object.keys(adapter.rooms);

  console.info(`User ${id} connected. Rooms: ${rooms}.`);
  db.sockets.add({ id, rooms });
};
const disconnected = (socket) => {
  const { id } = socket;

  console.info(`User ${id} disconnected.`);
  db.sockets.delete({ id });
};

const subscribe = async(data, socket) => {
  const { room } = data;
  joinRoom(room, socket);

  const { id, adapter } = socket;
  const rooms = Object.keys(adapter.rooms);

  await db.sockets.setRooms({ id, rooms });
};
const unsubscribe = async(data, socket) => {
  const { room } = data;
  socket.leave(room);

  const { id, adapter } = socket;
  const rooms = Object.keys(adapter.rooms);

  await db.sockets.setRooms({ id, rooms });
};

module.exports = (socket, io) => {
  connected(socket);

  socket.on('subscribe', data => subscribe(data, socket));
  socket.on('unsubscribe', data => unsubscribe(data, socket));

  socket.on('new_message', data => newMessage(data, socket, io.in('chat')));

  socket.on('disconnect', () => {
    disconnected(socket);
  });
};
