const fs = require('fs');

var stats = [];

function load(file) {
  let raw = fs.readFileSync(file);
  let data = JSON.parse(raw);
  for (let row of data) {
    stats[row.id] = row
  }
}

load('official.json')
load('user.json')

var valid = [];

for (let i = 1; i <= 6169; i++) {
  if (stats[i]) {
    let raw = fs.readFileSync('./stat/' + i + '.json');
    let data = JSON.parse(raw);
    if (data['monthly_founds'] && [2611, 2711, 20, 10, 60, 3200, 25600, 120, 110, 1420, 1410, 20710, 1720, 1710].includes(stats[i].hash_type)) {
      var date = new Date(stats[i].created_at);
      const values = Object.entries(data['monthly_founds']);
      const found = [];
      const sum = values.reduce((s, v) => s + v[1], 0);
      const init = stats[i].found_hashes - sum;
      for (let j = 0; j < 24; j++) {
        const in_range = values.filter(value => new Date(value[0]).getTime() <= date.getTime());
        const sum = init + in_range.reduce((s, v) => s + v[1], 0);
        const pct = sum / stats[i].total_hashes;
        found.push(pct);
        date.setMonth(date.getMonth() + 1);
      }
      if (stats[i].found_hashes > 0) {
        valid.push(found);
      }
    }
  }
}

const avg = [];

for (let i = 0; i < 24; i++) {
  const sum = valid.map(a => a[i]).reduce((s, v) => s + v, 0);
  avg.push(sum / valid.length);
}

console.log(avg);
