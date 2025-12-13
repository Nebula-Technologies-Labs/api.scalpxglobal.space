const mongoose = require("mongoose");

const orderType = [0, 1]; // 0 - BUY , 1 - SELL
const orderOption = [0, 1, 2]; // 0 - MARKET , 1 - LIMIT, 2 - STOPLOSS
const orderStatus = [0, 1, 2, 3]; // 0 - PENDING , 1 - EXECUTED, 2 - REJECTED, 3 - CANCELLED
const tradeOption = [0, 1]; // 0 - INTRADAY , 1 - OVERNIGHT
const stoplossOption = [0, 1]; // 0 - MARKET, 1- LIMIT

const orderSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    token: { required: true, type: String },
    orderType: { required: true, type: Number, enum: orderType },
    orderOption: { required: true, type: Number, enum: orderOption },
    orderStatus: { required: true, type: Number, enum: orderStatus },
    tradeOption: { required: true, type: Number, enum: tradeOption },
    average: { required: true, type: Number },
    totalAmount: { required: true, type: Number },
    brokerage: { required: true, type: Number },
    quantity: { required: true, type: Number },
    symbol: { required: true, type: String },
    name: { required: true, type: String },
    exchangeType: { required: true, type: String },
    instrumenttype: { required: true, type: String },
    expiryDate: { required: true, type: String },
    margin: { required: true, type: Number },
    limit: {type: Number, default: null },
    triggerPrice: {type: Number, default: null },
    stoplossOption: {
      type: Number,
      enum: stoplossOption,
      default: null,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
