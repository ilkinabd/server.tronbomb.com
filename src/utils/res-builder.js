const errors = {
  73400: {
    message: 'User does not exist.'
  },
  73401: {
    message: 'Wrong data.'
  },
  73402: {
    message: 'Ban.'
  },
  73403: {
    message: 'Not enougth level.'
  },
  73430: {
    auth: false,
    message: 'No token provided.'
  },
  73431: {
    auth: false,
    message: 'Wrong token.'
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
