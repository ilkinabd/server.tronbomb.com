const db = require('../../db');


const handlerMessagesHistory = async(socket) => {
  const messages = await db.messages.getHistory();
  const { id } = socket;

  console.info(`WS: ${id} subscribe to messages.`);

  socket.emit('messages_history', {
    status: 'success',
    messages
  });
};

const handlerNewMessage = async(socket, data) => {

  const messageId = await db.messages.add(data);

  if (!messageId) return socket.send();

  const message = { messageId, ...data };
  const { id } = socket;
  console.info(`WS: ${id} add new messages.`);

  const response = {
    status: 'success',
    message
  };

  socket.emit('new_message', response);
  socket.broadcast.emit('new_message', response);
};

const onMessage = (socket) => {
  socket.on('messages_history', () => handlerMessagesHistory(socket));
  socket.on('new_message', data => handlerNewMessage(socket, data));
};

module.exports = {
  onMessage,
};
