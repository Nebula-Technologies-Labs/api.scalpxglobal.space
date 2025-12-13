const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const clientSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    userId: { type: String, required: true },
    availableFunds: { type: Number, required: true },
    isDemoId: { type: Boolean, default: false },
    portfolioValue: { type: Number },
    futMargin: { type: Number, required: true, default: 0 },
    optMargin: { type: Number, required: true, default: 1 },
    optBrokerage: { type: Number, required: true, default: 20 },
    futBrokerage: { type: Number, required: true, default: 500 },
    isAccountBlocked: { type: Boolean, required: true, default: false },
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
    orderId: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
    watchlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "watchlist" }],
    recentSearch: [
      { type: mongoose.Schema.Types.ObjectId, ref: "recentSearch" },
    ],
  },
  { timestamps: true }
);

clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

clientSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const clientModel = mongoose.model("client", clientSchema);
module.exports = clientModel;
