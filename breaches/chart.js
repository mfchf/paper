const fs = require('fs');

const md5_unsalted = [];
const md5_salted = [];
const bcrypt_salted = [];
const sha1_unsalted = [];
const sha1_salted = [];
const sha256_unsalted = [];
const sha256_salted = [];
const sha512_unsalted = [];
const sha512_salted = [];
const pbkdf2_salted = [];

const stats = [];

function load(file) {
  let raw = fs.readFileSync(file);
  let data = JSON.parse(raw);
  for (let row of data) {
    stats[row.id] = row
  }
}

load('official.json')
load('user.json')

for (let i = 1; i <= 6169; i++) {
  if (stats[i]) {
    const data = stats[i];
    if([0, 2600].includes(data.hash_type)) md5_unsalted.push(data.found_hashes / data.total_hashes);
    if([2611, 2711, 20, 10, 60].includes(data.hash_type)) md5_salted.push(data.found_hashes / data.total_hashes);
    if([3200, 25600].includes(data.hash_type)) bcrypt_salted.push(data.found_hashes / data.total_hashes);
    if([100, 4700].includes(data.hash_type)) sha1_unsalted.push(data.found_hashes / data.total_hashes);
    if([120, 110].includes(data.hash_type)) sha1_salted.push(data.found_hashes / data.total_hashes);
    if([1400].includes(data.hash_type)) sha256_unsalted.push(data.found_hashes / data.total_hashes);
    if([1420, 1410, 20710].includes(data.hash_type)) sha256_salted.push(data.found_hashes / data.total_hashes);
    if([1700].includes(data.hash_type)) sha512_unsalted.push(data.found_hashes / data.total_hashes);
    if([1720, 1710].includes(data.hash_type)) sha512_salted.push(data.found_hashes / data.total_hashes);
    if([10000, 22000].includes(data.hash_type)) pbkdf2_salted.push(data.found_hashes / data.total_hashes);
  }
}

fs.writeFileSync('data/md5_unsalt.txt', JSON.stringify(md5_unsalted));
fs.writeFileSync('data/md5_salted.txt', JSON.stringify(md5_salted));
fs.writeFileSync('data/bcrypt_sal.txt', JSON.stringify(bcrypt_salted));
fs.writeFileSync('data/sha1_unsal.txt', JSON.stringify(sha1_unsalted));
fs.writeFileSync('data/sha1_salte.txt', JSON.stringify(sha1_salted));
fs.writeFileSync('data/sha256_uns.txt', JSON.stringify(sha256_unsalted));
fs.writeFileSync('data/sha256_sal.txt', JSON.stringify(sha256_salted));
fs.writeFileSync('data/sha512_uns.txt', JSON.stringify(sha512_unsalted));
fs.writeFileSync('data/sha512_sal.txt', JSON.stringify(sha512_salted));
fs.writeFileSync('data/pbkdf2_sal.txt', JSON.stringify(pbkdf2_salted));
