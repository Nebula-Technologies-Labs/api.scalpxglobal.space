const brokerModel = require("../models/broker.model");
const AdminModel = require("../models/admin.model");
const clientModel = require("../models/client.model");
const subscribeModel = require("../models/subscribe.model");
const instrumentModel = require("../models/instruments.model");
const exchangeMapping = require("../util/exchangeMapping");
const expressAsyncHandler = require("express-async-handler");

const registerClient = expressAsyncHandler(async (req, res) => {
  try {
    const {
      userName,
      password,
      userId,
      totalFunds,
      marginRatio,
      brokeragePercentage,
      isDemoId,
    } = req.body;
    const isAdmin = await AdminModel.findOne({ _id: req.user });

    if (!isAdmin)
      return res.status(401).json({ message: "UnAuthorized request" });

    const client = await clientModel.create({
      userId,
      userName,
      password,
      totalFunds,
      marginRatio,
      brokerId: isAdmin._id,
      portfolioValue: 0,
      brokeragePercentage,
      isDemoId,
    });

    return res
      .status(200)
      .json({ message: "User Created Successfully", client });
  } catch (error) {
    return res.status(401).json({ message: "Client Created Failed" });
  }
});

const registerBroker = expressAsyncHandler(async (req, res) => {
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

const fetchAllBrokers = expressAsyncHandler(async (req, res) => {
  try {
    const isAdmin = await AdminModel.findOne({ _id: req.user });
    if (!isAdmin)
      return res.status(401).json({ message: "UnAuthorized Access" });
    const brokers = await brokerModel.find().select("-password");
    return res.status(200).json(brokers);
  } catch (error) {
    return res.status(401).json({ message: "Bad request" });
  }
});

const subscribeInstrument = expressAsyncHandler(async (req, res) => {
  try {
    const { instrumentId } = req.params;
    if (!instrumentId)
      return res.status(403).json({ message: "Invalid request" });
    const admin = await AdminModel.findById(req.user);
    if (!admin) return res.status(403).json({ message: "UnAuthorized Access" });
    const instrument = await instrumentModel.findById(instrumentId);
    if (!instrument) return res.status(403).json("Invalid Instrument");

    const isSubscribedInstrument = await subscribeModel.findById(
      instrument._id
    );
    if (isSubscribedInstrument)
      return res.status(403).json("Instrument Already Subscribed");

    const subscription = await subscribeModel.create({
      token: instrument.token,
      exchangeType: exchangeMapping(instrument.exch_seg),
    });
    return res.status(200).json({ subscription });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
const unSubscribeInstrument = expressAsyncHandler(async (req, res) => {
  try {
    const { instrumentId } = req.params;
    if (!instrumentId)
      return res.status(403).json({ message: " Missing Params" });
    const admin = await AdminModel.findById(req.user);
    if (!admin) return res.status(403).json({ message: "UnAuthorized Access" });
    const instrument = await instrumentModel.findById(instrumentId);
    if (!instrument)
      return res.status(403).json({ message: "Invalid Instrument" });
    const isSubscribedInstrument = await subscribeModel.findById(
      instrument._id
    );
    if (!isSubscribedInstrument)
      return res.status(403).json({ message: "Instrument not subscribed" });

    await subscribeModel.findByIdAndDelete(instrument._id);
    return res
      .status(200)
      .json({ message: "Instrument Successfully Unsubscribe" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const fetchSubscribedInstruments = expressAsyncHandler(async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.user);
    if (!admin) return res.status(403).json({ message: "UnAuthorized Access" });
    const subscribeInstruments = await subscribeModel.find();
    return res.status(200).json({ subscribeInstruments });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  registerBroker,
  registerClient,
  fetchAllClients,
  fetchAllBrokers,
  subscribeInstrument,
  unSubscribeInstrument,
  fetchSubscribedInstruments,
  fetchSubscribedInstruments,
  subscribeInstrument,
  unSubscribeInstrument,
};
