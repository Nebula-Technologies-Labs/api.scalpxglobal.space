const jwt = require("jsonwebtoken");

const authToken = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET, { expiresIn: "2d" });
};

module.exports = authToken;
