const fs = require('fs');

var stats = [];

function load(file) {
  let raw = fs.readFileSync(file);
  let data = JSON.parse(raw);
  for (let row of data) {
    stats[row.id] = row
  }
}

function std(array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b, 0) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n)
}

load('official.json')
load('user.json')

var types = [];

for (let i = 1; i <= 6169; i++) {
  if (stats[i]) {
    const data = stats[i];
    if (!types[data.hash_type]) types[data.hash_type] = [];

    let raw = fs.readFileSync('./stat/' + i + '.json');
    let stat = JSON.parse(raw);

    let sum = 0;
    if (stat['monthly_founds']) {
        const start = new Date(stats[i].created_at).getTime();
        for (let found of Object.entries(stat['monthly_founds'])) {
          const delta = new Date(found[0]).getTime() - start;
          sum += found[1] * delta;
        }
        const found = [];
    }

    data.time = sum / data.found_hashes;
    types[data.hash_type].push(data);
  }
}

var data = "";

for (let row of Object.entries(types)) {
  const mode = parseInt(row[0]);
  const type = row[1][0].algorithm.replaceAll(',', ' ');
  const count = row[1].length;
  const ratios = row[1].map(x => x.found_hashes / x.total_hashes);
  const foundmean = ratios.reduce((a, b) => a + b, 0) / count;
  const foundstdev = std(ratios);
  const times = row[1].map(x => x.time).filter(x => x);
  const timemean = times.reduce((a, b) => a + b, 0) / times.length;
  const timestdev = std(times);
  data += `${mode}, ${type}, ${count}, ${foundmean}, ${foundstdev}, ${timemean}, ${timestdev}` + "\n";
}

fs.writeFileSync("results.csv", data)
