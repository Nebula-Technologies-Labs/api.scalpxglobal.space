const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL_TEST)
    .then(() => {
      console.log("Database Connected...");
    })
    .catch((err) => {
      console.log("Database Connection error:", err);
    });
};

module.exports = {connectDatabase};
