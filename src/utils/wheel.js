const sectors = [
  0, 4, 0, 1, 0, 2, 1, 0, 3, 0,
  2, 0, 1, 0, 6, 0, 1, 0, 2, 1,
  0, 3, 0, 2, 0, 1, 0, 4, 0, 1,
  0, 2, 1, 0, 3, 0, 2, 0, 1, 0,
  5, 0, 1, 0, 2, 1, 0, 3, 0, 2,
  0, 1
];

const coefs = [2, 4, 6, 12, 24, 48, 48];

const getSector = (index) => sectors[index];
const getCoef = (sector) => coefs[sector];

module.exports = {
  getSector,
  getCoef,
};
