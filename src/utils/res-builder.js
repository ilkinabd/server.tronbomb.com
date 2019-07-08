const errors = {
  73400: {
    message: 'User does not exist.'
  },
  73500: {
    message: 'Internal server error.'
  },
};

const success = (data) => Object.assign({ status: 'success' }, data);
const error = (code) => Object.assign({ status: 'error', code }, errors[code]);

module.exports = {
  success,
  error,
};
