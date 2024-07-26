require("dotenv").config();
const catalogConsumer = require('./src/consumers/catalogConsumer');


const app = require("./src/app");
const sequelize = require('./src/config/database');

const port = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      catalogConsumer.connectConsumer();
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
