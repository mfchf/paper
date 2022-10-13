const bcrypt = require('bcrypt');
const fs = require('fs');

const N = 10;

const data = [0];

function ns(time) {
  return +time[0] * 1e9 + +time[1];
};

(async () => {
  for (let i = 1; i <= 16; i++) {
    const start = ns(process.hrtime());
    for (let j = 0; j < N; j++) {
      await bcrypt.hash('password', i);
    }
    const end = ns(process.hrtime());
    data.push((end - start) / (N * 1e6));
  }

  console.log(data);
  fs.writeFileSync('benchmark.json', JSON.stringify(data));
})();
