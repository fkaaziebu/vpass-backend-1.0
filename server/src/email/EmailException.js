const en = require("../../locales/en/translation.json");
module.exports = function EmailException() {
  this.message = en.email_failure;
  this.status = 502;
};
