const expressAsyncHandler = require("express-async-handler");
const AdminModel = require("../models/admin.model");
const clientModel = require("../models/client.model");
const AuthToken = require("../util/authToken");

const loginAdminUser = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(401).json({ message: "userId or password invalid" });

    const admin = await AdminModel.findOne({ userId });
    if (!admin)
      return res.status(401).json({ message: "userId or password invalid" });

    const verified = await admin.comparePassword(password);
    if (!verified)
      return res.status(401).json({ message: "userId or password invalid" });
    console.log(admin._id);
    const token = await AuthToken(admin._id);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
});

const loginClientUser = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(403).json({ message: "UserId or Password Invalid" });

    const client = await clientModel.findOne({ userId });
    if (!client)
      return res.status(401).json({ message: "UserId or Password Invalid" });

    const verified = await client.comparePassword(password);
    if (!verified)
      return res.status(401).json({ message: "UserId or Password invalid" });

    const token = await AuthToken(client._id);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
});

const loginBrokerUser = expressAsyncHandler(async (req, res) => {});

module.exports = {
  loginAdminUser,
  loginClientUser,
  loginBrokerUser,
};
