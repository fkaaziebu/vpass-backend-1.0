function generateOTP(length, options = {}) {
  let raw = "";
  length = 6;
  options.numeric = true;
  options.uppercase = false;
  options.lowercase = false;
  options.symbols = false;

  if (options.numeric) {
    raw += "0123456789";
  }

  if (options.uppercase) {
    raw += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (options.lowercase) {
    raw += "abcdefghijklmnopqrstuvwxyz";
  }

  if (options.symbols) {
    raw += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  }

  let result = "";

  for (let i = 0; i < length; i++) {
    result += raw[Math.floor(Math.random() * raw.length)];
  }

  return result;
}

module.exports = generateOTP;
