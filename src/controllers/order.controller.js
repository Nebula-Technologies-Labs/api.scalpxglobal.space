const expressAsyncHandler = require("express-async-handler");
const orderModel = require("../models/order.model");
const instrumentModel = require("../models/instruments.model");
const clientModel = require("../models/client.model");

const fetchClientOrders = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user })
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const createNewOrder = expressAsyncHandler(async (req, res) => {
  try {
    const {
      token,
      orderType,
      orderOption,
      stopLossEnabled,
      stockLTP,
      totalAmount,
      brokerage,
      limitPrice,
      orderMargin,
      quantity,
      tradeOption,
    } = req.body;
    const client = await clientModel.findById(req.user);
    const instrument = await instrumentModel.findOne({ token });
    if (!client) return res.status(404).json({ message: "User not found" });
    if (!instrument)
      return res.status(404).json({ message: "Instrument not found" });

    if (client.availableFunds < Number(totalAmount))
      return res.status(401).json({ message: "Insufficent Funds" });
    const order = await orderModel.create({
      token,
      brokerage,
      orderType,
      orderOption,
      orderStatus: orderOption === "MARKET" ? "EXECUTED" : "PENDING",
      stopLossEnabled,
      stockLTP,
      orderMargin,
      totalAmount,
      limitPrice,
      userId: client._id,
      quantity,
      tradeOption,
      symbol: instrument.symbol,
      name: instrument.name,
      exchangeType: instrument.exch_seg,
      instrumenttype: instrument.instrumenttype,
      expiryDate: instrument.expiry,
      lotsize: instrument.lotsize,
    });
    if (order) {
      client.orderId.push(order._id);
      client.availableFunds = client.availableFunds - order.totalAmount;
      await client.save();
      return res.status(200).json({ order });
    }
    return res.status(403).json({ message: "Order Not Done!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const fetchOrderById = expressAsyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(403).json({ message: "Bad request" });
    const order = await orderModel.findById(orderId);
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  fetchClientOrders,
  createNewOrder,
  fetchOrderById,
};
