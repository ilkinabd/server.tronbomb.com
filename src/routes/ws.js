const controller = require('../controllers/ws');

module.exports = (socket) => {
  const { id } = socket;

  console.log(`WS: User ${id} connected`);

  socket.emit('connected', { status: 'success', id });

  controller.onMessage(socket);

  socket.on('disconnect', () => console.log(`WS: User ${id} disconnected`));
};
