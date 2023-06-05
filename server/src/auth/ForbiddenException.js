const en = require("../../locales/en/translation.json");
module.exports = function ForbiddenException() {
  this.status = 403;
  this.message = en.inactive_authentication_failure;
};
