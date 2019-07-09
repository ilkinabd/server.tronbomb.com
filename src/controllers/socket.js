const { CHAT_USER_LEVEL } = process.env;

const db = require('@db');

const { error } = require('@utils/res-builder');

db.sockets.clear();

const joinRoom = async(room, socket) => {
  socket.join(room);

  let response;
  switch (room) {
    case 'rating':
      response = await db.users.getTop({ limit: 100 });
      socket.emit('rating', { rating: response }); break;
    case 'chat':
      response = await db.messages.getByLimit({ limit: 50 });
      socket.emit('chat', { messages: response }); break;
  }
};

const connected = (socket) => {
  const { id, adapter } = socket;
  const rooms = Object.keys(adapter.rooms);

  console.log(`User ${id} connected. Rooms: ${rooms}`);
  db.sockets.add({ id, rooms });
};
const disconnected = (socket) => {
  const { id } = socket;

  console.log(`User ${id} disconnected`);
  db.sockets.delete({ id });
};

const firstMessage = async(socket) => {
  const games = await db.gamesContracts.getAll();
  const tokens = await db.tokens.getAll();

  socket.emit('config', { games, tokens });
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

const newMessage = async(data, socket, io) => {
  const { msg, wallet } = data;
  if (!msg || !wallet) return socket.emit('fail', error(73401));

  const userId = await db.users.getId({ wallet });
  if (!userId) return socket.emit('fail', error(73400));

  const user = await db.users.get({ userId });
  if (!user.level < CHAT_USER_LEVEL) return socket.emit('fail', error(73403));

  const ban = await db.bans.getStatus({ userId });
  if (ban) return socket.emit('fail', error(73402));

  const createAt = await db.messages.add({ data: JSON.stringify(msg), userId });
  io.in('chat').emit('chat', { messages: [{ data: msg, createAt, wallet }] });
};

module.exports = (socket, io) => {
  connected(socket);
  firstMessage(socket);

  socket.on('subscribe', (data) => subscribe(data, socket));
  socket.on('unsubscribe', (data) => unsubscribe(data, socket));

  socket.on('new_message', (data) => newMessage(data, socket, io));

  socket.on('disconnect', () => {
    disconnected(socket);
  });
};
