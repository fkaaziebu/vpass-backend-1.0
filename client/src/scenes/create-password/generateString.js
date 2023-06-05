function generateString(length, options = {}) {
  let raw = "";

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

export default generateString;
