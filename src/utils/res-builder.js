const errors = new Map();

errors.set(73400, 'User does not exist.');
errors.set(73401, 'Wrong data.');
errors.set(73402, 'Ban.');
errors.set(73403, 'Not enougth level.');
errors.set(73404, 'No token provided.');
errors.set(73405, 'Wrong token.');
errors.set(73500, 'Internal server error.');

const success = (data) => Object.assign({ status: 'success' }, data);
const error = (code) => ({ status: 'error', code, message: errors.get(code) });

module.exports = {
  resSuccess: success,
  resError: error,
};
