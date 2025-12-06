const mongoose = require("mongoose");

const recentSearchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "client" },
    token: [{ type: String, required: true }],
  },
  { timestamps: true }
);

recentSearchSchema.virtual("instruments", {
  localField: "token",
  ref: "instrument",
  foreignField: "token",
});

recentSearchSchema.set("toJSON", { virtuals: true });
recentSearchSchema.set("toObject", { virtuals: true });

const recentSearchModel = mongoose.model("recentSearch", recentSearchSchema);
module.exports = recentSearchModel;
