const app = require("./src/app");
const sequelize = require("./src/config/database");

sequelize.sync({ force: true });
// sequelize.sync({ force: true });

app.listen(3001, () => console.log("App is running!"));
