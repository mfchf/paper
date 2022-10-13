export default async function hotp(secret, counter) {
  // https://tools.ietf.org/html/rfc4226#section-5.1
  let formatCounter = (counter) => {
    let binStr = counter.toString(2).padStart(64, '0');
    let intArr = [];

    for (let i = 0; i < 8; i++) {
      intArr[i] = parseInt(binStr.slice(i * 8, i * 8 + 8), 2);
    }

    return Uint8Array.from(intArr).buffer;
  };

  let truncate = (buffer) => {
    let offset = buffer[buffer.length - 1] & 0xf;
    return (
      ((buffer[offset] & 0x7f) << 24) |
      ((buffer[offset + 1] & 0xff) << 16) |
      ((buffer[offset + 2] & 0xff) << 8) |
      (buffer[offset + 3] & 0xff)
    );
  };

  return crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: {name: 'SHA-1'} },
    false,
    ['sign']
  ).then((key) => {
    return crypto.subtle.sign('HMAC', key, formatCounter(counter))
  }).then((result) => {
    return (truncate(new Uint8Array(result)) % 10 ** 6 ).toString().padStart(6, '0')
  });
};
