const brokerModel = require("../models/broker.model");
const AdminModel = require("../models/admin.model");
const clientModel = require("../models/client.model");
const OrderModal = require("../models/order.model");
const expressAsyncHandler = require("express-async-handler");

const registerClientByAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { userName, password, userId, isDemoId, availableFunds, futMargin, optMargin } =
      req.body;
    const isAdmin = await AdminModel.findOne({ _id: req.user });

    if (!isAdmin)
      return res.status(401).json({ message: "UnAuthorized request" });

    const client = await clientModel.create({
      userId,
      userName,
      password,
      availableFunds,
      futMargin,
      optMargin,
      brokerId: isAdmin._id,
      brokerModelType: "admin",
      isDemoId,
    });

    return res
      .status(200)
      .json({ message: "User Created Successfully", client });
  } catch (error) {
    return res.status(401).json({ message: "Client Created Failed" });
  }
});

const registerBrokerByAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, brokerName, password } = req.body;

    const isAdmin = await AdminModel.findOne({ _id: req.user });

    if (!isAdmin)
      return res.status(401).json({ message: "UnAuthorized Access" });

    const broker = await brokerModel.create({
      userId,
      brokerName,
      password,
    });

    return res
      .status(200)
      .json({ message: "Broker Created Successfully", broker });
  } catch (error) {
    return res.status(401).json({ message: "Broker Created Failed" });
  }
});

const fetchAllClients = expressAsyncHandler(async (req, res) => {
  try {
    const isAdmin = await AdminModel.findOne({ _id: req.user });
    if (!isAdmin)
      return res.status(401).json({ message: "UnAuthorized Request" });
    const clients = await clientModel.find().select("-password");
    return res.status(200).json({ clients });
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
});

const fetchClientById = expressAsyncHandler(async (req, res) => {
  try {
    const { clientId } = req.params;
    const isAdmin = await AdminModel.findOne({ _id: req.user });
    if (!isAdmin)
      return res.status(401).json({ message: "UnAuthorized Request" });
    const client = await clientModel.findById(clientId).populate("orderId");
    return res.status(200).json({ client });
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
});

const fetchAllBrokers = expressAsyncHandler(async (req, res) => {
  try {
    const isAdmin = await AdminModel.findOne({ _id: req.user });
    if (!isAdmin)
      return res.status(401).json({ message: "UnAuthorized Access" });
    const brokers = await brokerModel.find().select("-password");
    return res.status(200).json({ brokers });
  } catch (error) {
    return res.status(401).json({ message: "Bad request" });
  }
});

const fetchAllOrders = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await OrderModal.find().populate(
      "userId",
      "userName userId "
    );
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteClient = expressAsyncHandler(async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.user);
    if (!admin) return res.status(403).json({ message: "UnAuthorized Access" });

    const { clientId } = req.params;
    const client = await clientModel.findById(clientId);
    if (!client)
      return res.status(404).json({ message: "Client Not Found!!!" });
    await clientModel.findByIdAndDelete(clientId);
    return res.status(200).json({ message: "Client Delete Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const deletebroker = expressAsyncHandler(async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.user);
    if (!admin) return res.status(403).json({ message: "UnAuthorized Access" });
    const { brokerId } = req.params;
    const broker = await brokerModel.findById(brokerId);
    if (!broker) return res.status(404).json({ mesage: "Broker Not found!!!" });
    await brokerModel.findByIdAndDelete(brokerId);
    return res.status(200).json({ message: "Broker Delete Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const blockClientAccount = expressAsyncHandler(async (req, res) => {
  try {
    const { clientId } = req.params;
    const admin = await AdminModel.findById(req.user);
    if (!admin) return res.status(401).json({ message: "unAuthorized Access" });
    await clientModel.findByIdAndUpdate(clientId, {
      $set: { isAccountBlocked: true },
    });
    return res.status(200).json({ message: "Client Block Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const unblockClientAccount = expressAsyncHandler(async (req, res) => {
  try {
    const { clientId } = req.params;
    const admin = await AdminModel.findById(req.user);
    if (!admin) return res.status(401).json({ message: "unAuthorized Access" });
    await clientModel.findByIdAndUpdate(clientId, {
      $set: { isAccountBlocked: false },
    });
    return res.status(200).json({ message: "Client Block Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  registerBrokerByAdmin,
  registerClientByAdmin,
  fetchAllClients,
  fetchAllBrokers,
  deleteClient,
  deletebroker,
  fetchAllOrders,
  fetchClientById,
  blockClientAccount,
  unblockClientAccount,
};
