const jwt = require("jsonwebtoken");

const authToken = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET);
};

module.exports = authToken;
