module.exports = (socket) => {
  const { id } = socket;

  console.log(`WS: User ${id} connected`);

  socket.emit('connected', { status: 'success', id });

  socket.on('disconnect', () => console.log(`WS: User ${id} disconnected`));
};
