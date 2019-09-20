const errors = new Map();

errors.set(73400, 'User does not exist.');
errors.set(73401, 'Wrong data.');
errors.set(73402, 'Ban.');
errors.set(73403, 'Not enougth level.');
errors.set(73404, 'No token provided.');
errors.set(73405, 'Wrong token.');
errors.set(73406, 'Referral id is already exist.');
errors.set(73407, 'Referral id does not exist.');
errors.set(73408, 'Invalid Referral id.');
errors.set(73409, 'User is already exist.');
errors.set(73410, 'Not enought funds.');
errors.set(73411, 'Unauthorized.');
errors.set(73500, 'Internal server error.');
errors.set(73600, 'Email already added.');
errors.set(73601, 'Incorrect email format.');
errors.set(73602, 'Cannot add contact that is blacklisted.');

const success = (data) => Object.assign({ status: 'success' }, data);
const error = (code, data) => Object.assign({
  status: 'error',
  code,
  message: errors.get(code),
}, data);

const successRes = (res, data) => res.json(Object.assign({
  status: 'success',
}, data));
const errorRes = (res, status, code, error) => res.status(status).json({
  status: 'error',
  code,
  message: errors.get(code),
  error,
});

module.exports = {
  resSuccess: success,
  resError: error,
  successRes,
  errorRes,
};
