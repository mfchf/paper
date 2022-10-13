const bcryptlib = require('bcrypt');
const argon2 = require('argon2');

const fs = require('fs');
const list = fs.readFileSync('10k.dict').toString().split("\n");
const crypto = require('crypto');

function ns(time) {
  return +time[0] * 1e9 + +time[1];
}

async function time(fn, iter, name) {
  const start = ns(process.hrtime());
  const hashes = [];
  for (let i = 0; i < iter; i++) {
    const hash = await fn();
    hashes.push(hash);
  }
  const end = ns(process.hrtime());
  const ms = (end - start) / (iter * 1e6);
  fs.writeFileSync(name + '.hash', hashes.join("\n"));
  console.log(name, ms);
}

async function md5() {
  const pass = list[Math.floor(Math.random()*list.length)];
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('md5').update(pass + salt).digest("hex");
  return hash + ':' + salt;
}

async function sha1() {
  const pass = list[Math.floor(Math.random()*list.length)];
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha1').update(pass + salt).digest("hex");
  return hash + ':' + salt;
}

async function sha256() {
  const pass = list[Math.floor(Math.random()*list.length)];
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha256').update(pass + salt).digest("hex");
  return hash + ':' + salt;
}

async function sha512() {
  const pass = list[Math.floor(Math.random()*list.length)];
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha512').update(pass + salt).digest("hex");
  return hash + ':' + salt;
}

async function pbkdf2() {
  const cost = 999999;
  const pass = list[Math.floor(Math.random()*list.length)];
  const salt = crypto.randomBytes(8);
  const hash = crypto.pbkdf2Sync(pass, salt, cost, 32, 'sha256');
  return '$pbkdf2-sha256$' + cost + '$' + salt.toString('base64').replaceAll('=', '') + '$' + hash.toString('base64').replaceAll('=', '');
}

async function bcrypt() {
  const cost = 12;
  const pass = list[Math.floor(Math.random()*list.length)];
  const hash = await bcryptlib.hash(pass, cost);
  return hash;
}

async function scrypt() {
  const cost = 2**15;
  const blocksize = 24;
  const pass = list[Math.floor(Math.random()*list.length)];
  const salt = crypto.randomBytes(14);
  const hash = crypto.scryptSync(pass, salt, 32, { N: cost, r: blocksize, p: 1, maxmem: 256 * blocksize * cost });
  return 'SCRYPT:' + cost + ':' + blocksize + ':1:' + salt.toString('base64') + ':' + hash.toString('base64');
}

async function argon2id() {
  const pass = list[Math.floor(Math.random()*list.length)];
  const hash = await argon2.hash(pass, {
    type: argon2.argon2d,
    timeCost: 150,
    memoryCost: 2**12,
    parallelism: 1
  });
  return hash
}

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


async function mfchf() {
  const pass = list[Math.floor(Math.random()*list.length)] + (between(0, 1000000).toString().padStart(6, '0'));
  console.log(pass)
  const hash = await argon2.hash(pass, {
    type: argon2.argon2d,
    timeCost: 150,
    memoryCost: 2**12,
    parallelism: 1
  });
  return hash
}

(async () => {
  // await time(md5, 100, 'md5');
  // await time(sha1, 100, 'sha1');
  // await time(sha256, 100, 'sha256');
  // await time(sha512, 100, 'sha512');
  // await time(pbkdf2, 10, 'pbkdf2');
  // await time(bcrypt, 10, 'bcrypt');
  // await time(scrypt, 10, 'scrypt');
  // await time(argon2id, 10, 'argon2id');
  await time(mfchf, 1, 'mfchf');
})();
