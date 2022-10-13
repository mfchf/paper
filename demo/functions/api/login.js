import hotp from './hotp';
const xor = require('buffer-xor');

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

function buf2hex(buffer) {
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

const hex2buf = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

function mod (n, m) {
  return ((n % m) + m) % m
}

const sha256 = async (data) => {
  const hash = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hash);
}

const pbkdf2 = async (pass, salt) => {
  const data = new TextEncoder().encode(pass);
  const key = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);
  const params = { name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: 1e5 }
  return new Uint8Array(await crypto.subtle.deriveBits(params, key, 256))
}

export async function onRequest(context) {
  try {
    const { request, env } = context;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email').trim().toLowerCase();
    const password = searchParams.get('password').trim();
    const otp = searchParams.get('otp');
    const tgt = searchParams.get('target');

    if (request.method !== "POST") {
      return new Response("Expected POST", {status: 400});
    } else if (typeof email !== 'string' || email.length === 0) {
      return new Response("Expected email", {status: 400});
    } else if (!validateEmail(email)) {
      return new Response("Invalid email", {status: 400});
    } else if (typeof password !== 'string' || password.length === 0) {
      return new Response("Expected password", {status: 400});
    } else if ((typeof otp !== 'string' || otp.length === 0) && (typeof tgt !== 'string' || tgt.length === 0)) {
      return new Response("Expected otp or target", {status: 400});
    } else {
      const key = 'user#' + email.toLowerCase();
      const user = await env.DB.get(key);

      if (user) {
        const data = JSON.parse(user);
        if (tgt) { // Handle persisted HOTP factor
          const target = parseInt(tgt);
          const salt = hex2buf(data.salt);
          const mainHash = await pbkdf2(password + target, salt);
          if (buf2hex(await sha256(mainHash)) === data.mainHash) {
            return new Response(JSON.stringify({
              valid: true
            }), {status: 200});
          } else {
            return new Response(JSON.stringify({
              valid: false
            }), {status: 200});
          }
        } else { // Handle non-persisted HOTP factor
          const target = mod(data.offset + parseInt(otp), 10 ** 6);
          const salt = hex2buf(data.salt);
          const mainHash = await pbkdf2(password + target, salt);
          if (buf2hex(await sha256(mainHash)) === data.mainHash) { // HOTP counter is synchronized
            const hotpSecret = xor(hex2buf(data.pad), mainHash)
            data.ctr++;
            const nextCode = await hotp(hotpSecret, data.ctr);
            const offset = mod(target - nextCode, 10 ** 6)
            data.offset = offset;
            const laterCode = await hotp(hotpSecret, data.ctr + 1);
            const windowOffset = mod(target - laterCode, 10 ** 6)
            data.windowOffset = windowOffset;
            await env.DB.put(key, JSON.stringify(data));
            return new Response(JSON.stringify({
              valid: true,
              nextCode, laterCode, target
            }), {status: 200});
          } else {
            const data = JSON.parse(user);
            const target = mod(data.windowOffset + parseInt(otp), 10 ** 6)
            const salt = hex2buf(data.salt);
            const mainHash = await pbkdf2(password + target, salt);
            if (buf2hex(await sha256(mainHash)) === data.mainHash) { // HOTP counter is desynchronized by 1
              const hotpSecret = xor(hex2buf(data.pad), mainHash)
              data.ctr += 2;
              const nextCode = await hotp(hotpSecret, data.ctr);
              const offset = mod(target - nextCode, 10 ** 6);
              data.offset = offset;
              const laterCode = await hotp(hotpSecret, data.ctr + 1);
              const windowOffset = mod(target - laterCode, 10 ** 6);
              data.windowOffset = windowOffset;
              await env.DB.put(key, JSON.stringify(data));
              return new Response(JSON.stringify({
                valid: true,
                nextCode, laterCode, target
              }), {status: 200});
            } else {
              return new Response(JSON.stringify({
                valid: false
              }), {status: 200});
            }
          }
        }
      } else {
        return new Response("User doesn't exist", {status: 400});
      }
    }
  } catch (err) {
    return new Response("Internal error: " + err.name + ": " + err.message, {status: 400});
  }
}
