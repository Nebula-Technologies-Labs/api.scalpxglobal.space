const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    instrumentId: { required: true, type: String },
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
  },
  { timestamps: true }
);

orderSchema.virtual("instrument", {
  foreignField: "token",
  ref: "instrument",
  localField: "instrumentId",
  justOne: true,
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
