const mongoose = require("mongoose"); 

const orderSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "brokerModelType",
      required: true,
    },
    brokerModelType: {
      type: String,
      enum: ["admin", "broker"],
      required: true,
    },
    token: { required: true, type: String },
    symbol: { required: true, type: String },
    segment: { required: true, type: String },
    instrumentType: {
      required: true,
      type: String,
      enum: ["OPTSTK", "OPTFUT", "OPTIDX"],
    },
    expiry: { required: true, type: String },
    name: { required: true, type: String },
    quantity: { required: true, type: String },
    buyPrice: { required: true, type: Number },
    brokerage: { required: true, type: Number },
    totalAmount: { required: true, type: Number },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  try {
    if (this.instrumentType !== "OPTIDX") {
      this.brokerage = 500;
      this.totalAmount = this.buyPrice + 500;
    } else {
      const livePrice = tickMap[this.token]?.last_traded_price;
      if (!livePrice) throw new Error("Live price not found for token");

      const brokerageValue = (livePrice / 100) * this.brokerage;
      this.totalAmount = livePrice + brokerageValue;
    }
    next();
  } catch (err) {
    next(err);
  }
});

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
