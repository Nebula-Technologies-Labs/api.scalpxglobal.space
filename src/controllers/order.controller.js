const expressAsyncHandler = require("express-async-handler");
const orderModel = require("../models/order.model");
const instrumentModel = require("../models/instruments.model");
const clientModel = require("../models/client.model");
const { tickMap } = require("../services/smartApi.service");
const calculateTotalPrice = require("../util/CalculateTotalAmount");

const fetchClientOrders = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const createNewOrder = expressAsyncHandler(async (req, res) => {
  try {
    const {
      token,
      quantity,
      orderType,
      orderOption,
      tradeOption,
      lotQuantity,
    } = req.body;
    const client = await clientModel.findById(req.user);
    const instrument = await instrumentModel.findOne({ token });
    if (!client)
      return res.status(401).json({ message: "UnAuthorized Access" });

    if (!instrument) return res.status(403).json({ message: "Bad Request" });
    const data = tickMap.get(token);
    const average = data.last_traded_price;
    if (!average) return res.status(403).json({ message: "Bad Request" });
    const { totalAmount, margin, brokerage } = calculateTotalPrice(
      instrument.instrumenttype,
      Number(average),
      client.futMargin,
      client.optMargin,
      quantity,
      lotQuantity
    );

    const order = await orderModel.create({
      token,
      average,
      brokerage,
      exchangeType: instrument.exch_seg,
      expiryDate: instrument.expiry,
      instrumenttype: instrument.instrumenttype,
      name: instrument.name,
      orderOption: orderOption,
      orderStatus: 1,
      orderType: orderType,
      quantity: quantity,
      symbol: instrument.symbol,
      totalAmount: totalAmount,
      userId: client._id,
      tradeOption: tradeOption,
      margin: margin,
    });

    client.availableFunds = client.availableFunds - totalAmount;
    client.orderId.push(order._id);
    await client.save();
    return res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
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
