const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const clientSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    userId: { type: String, required: true },
    totalFunds: { type: Number, required: true },
    isDemoId: { type: Boolean, default: false },
    portfolioValue: Number,
    margin: { type: Number, required: true },
    brokeragePercentage: { type: Number, default: 1 },
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
