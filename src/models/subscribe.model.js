const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    exchangeType: { type: Number, required: true, enum: [1, 2, 3, 5] },
  },
  { timestamps: true }
);

const SubscribeModel = mongoose.model("subscribe", subscribeSchema);
module.exports = SubscribeModel;
