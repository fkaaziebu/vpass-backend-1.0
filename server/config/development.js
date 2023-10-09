module.exports = {
  database: {
    database: "driver-management",
    username: "driver-management",
    password: "db-p4ss",
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  },
  mail: {
    service: "gmail",
    auth: {
      user: "haaziebu@gmail.com",
      pass: "jppevhqlnferfoeh",
    },
  },
  uploadDir: "uploads-dev",
  profileDir: "profile",
  mailConfig: {
    from: "haaziebu@gmail.com",
  },
  logFileName: "app-dev.log",
  logFolderName: "logs-dev/",
};
