module.exports = {
  database: {
    database: "driver-management",
    username: "driver-management",
    password: "db-p4ss",
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
  mail: {
    host: "localhost",
    port: 8587,
    tls: {
      rejectUnauthorized: false,
    },
  },
  uploadDir: "uploads-test",
  profileDir: "profile",
  mailConfig: {
    from: "My App <info@my-app.com>",
  },
  logFileName: "app-test.log",
  logFolderName: "logs-test/",
};
