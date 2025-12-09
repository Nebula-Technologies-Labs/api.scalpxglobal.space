const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    token: { required: true, type: String },
    orderType: { required: true, type: String, enum: ["BUY", "SELL"] },
    orderOption: { requried: true, type: String, enum: ["MARKET", "LIMIT"] },
    orderStatus: {
      required: true,
      type: String,
      enum: ["PENDING", "EXECUTED"],
    },
    tradeOption: {
      required: true,
      type: String,
      enum: ["INTRADAY", "OVERNIGHT"],
    },
    stopLossEnabled: { required: true, type: Boolean },
    stopLossPrice: { type: Number },
    stockLTP: { required: true, type: Number },
    orderMargin: { required: true, type: Number },
    totalAmount: { required: true, type: Number },
    brokerage: { required: true, type: Number },
    limitPrice: { type: Number },
    quantity: { required: true, type: Number },
    symbol : {required : true, type: String},
    name : {required : true , type : String},
    exchangeType : {required : true , type : String},
    instrumenttype : {required : true , type : String},
    expiryDate : {required: true , type : String},
    lotsize : {required : true , type : String},
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
