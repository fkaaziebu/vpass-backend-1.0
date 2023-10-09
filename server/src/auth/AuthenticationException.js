const en = require("../../locales/en/translation.json");
module.exports = function AuthenticationException() {
  this.status = 401;
  this.message = en.authentication_failure;
};
