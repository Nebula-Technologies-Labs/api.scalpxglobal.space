const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  userName: String,
  userId: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  clientId: [{ type: mongoose.Schema.Types.ObjectId, ref: "clients" }],
},{timestamps : true});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AdminModel = mongoose.model("admin", AdminSchema);
module.exports = AdminModel;
