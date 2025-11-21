const mongoose = require("mongoose");

const brokerSchema = new mongoose.Schema(
  {
    userId: String,
    password: String,
    brokerName: String,
  },
  { timestamps: true }
);

brokerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

brokerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const brokerModel = mongoose.model("broker", brokerSchema);
module.exports = brokerModel;
