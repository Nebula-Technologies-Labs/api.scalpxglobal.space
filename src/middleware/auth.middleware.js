const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const authToken = expressAsyncHandler(async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ") ||
      !req.headers.authorization.split(" ")[1]
    ) {
      return res.status(401).json({ message: "UnAuthorized Request" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const verified = await jwt.verify(token, process.env.SECRET);
    if (!verified) throw new UnAuthorizedError();
    req.user = verified.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "UnAuthorized Request" });
  }
});

module.exports = authToken;
