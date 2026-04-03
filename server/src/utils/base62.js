const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num) {
  if (num === 0) return charset[0];
  let res = '';
  while (num > 0) {
    res = charset[num % 62] + res;
    num = Math.floor(num / 62);
  }
  return res;
}

module.exports = { encodeBase62 };
