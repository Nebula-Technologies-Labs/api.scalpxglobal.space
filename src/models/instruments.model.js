const mongoose = require("mongoose");

const instrumentScehama = new mongoose.Schema(
  {
    token: { type: String, required: true },
    symbol: { type: String, required: true },
    name: String,
    expiry: String,
    strike: String,
    lotsize: String,
    instrumenttype: String,
    exch_seg: String,
    tick_size: String,
  },
  { timestamps: true }
);

const instrumentModel = mongoose.model("instrument", instrumentScehama);

module.exports = instrumentModel;
