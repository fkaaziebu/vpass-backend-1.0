const app = require("./src/app");
const sequelize = require("./src/config/database");
const User = require("./src/user/User");
const bcrypt = require("bcrypt");

const addUsers = async () => {
  const hash = await bcrypt.hash("P4ssword", 10);

  for (let i = 0; i < 10; i++) {
    await User.create({
      username: `frederickaziebu199${i + 1}`,
      email: `frederickaziebu199${i + 1}@gmail.com`,
      password: hash,
    });
  }
};

sequelize.sync({ force: true }).then(async () => {
  await addUsers();
});

app.listen(3001, () => console.log("App is running!"));
