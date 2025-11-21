const expressAsyncHandler = require("express-async-handler");
const orderModel = require("../models/order.model");

const fetchAllClientOrders = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user });
    return res.status(200).json({ orders });
  } catch (error) {
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

module.exports = { fetchAllClientOrders, fetchOrderById };
