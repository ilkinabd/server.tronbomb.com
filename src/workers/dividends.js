const day = 24 * 60 * 60 * 1000;

const calculateProfit = () => {
  console.log(new Date());
};

const updateTime = new Date().setUTCHours(12, 0, 0);
const now = Date.now();
const timeout = now < updateTime ? updateTime - now : updateTime + day - now;

setTimeout(() => {
  calculateProfit();
  setInterval(calculateProfit, day);
}, timeout);
