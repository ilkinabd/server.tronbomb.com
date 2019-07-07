const connected = (id) => {
  console.log(`User ${id} connected`);
};
const disconnected = (id) => {
  console.log(`User ${id} disconnected`);
};

module.exports = (socket) => {
  const { id } = socket;
  connected(id);

  socket.on('disconnect', () => {
    disconnected(id);
  });
};
