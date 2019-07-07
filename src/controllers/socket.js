const db = require('@db');

db.sockets.clear();

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

module.exports = (socket) => {
  socket.join('test room');
  connected(socket);

  socket.on('disconnect', () => {
    disconnected(socket);
  });
};
