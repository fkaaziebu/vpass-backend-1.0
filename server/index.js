const app = require("./app");
const sequelize = require("./src/config/database");

sequelize.sync({ force: true });

app.listen(3001, () => console.log("App is running!"));
