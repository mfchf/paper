const bcrypt = require('bcrypt');
const fs = require('fs');

const N = 10;
const list = fs.readFileSync('list.txt').toString().split("\n");

(async () => {
  for (let i = 5; i <= 16; i++) {
    const data = [];
    for (let j = 0; j < N; j++) {
      const pass = list[Math.floor(Math.random()*list.length)];
      const hash = await bcrypt.hash(pass, i);
      data.push(hash);
    }
    fs.writeFileSync(i + '.txt', data.join("\n"));
  }
})();
