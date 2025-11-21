const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      requried: true,
      ref: "client",
    },
    instrumentId: [{ type: String }],
  },
  { timestamps: true }
);

watchlistSchema.virtual("instruments", {
  localField: "instrumentId",
  ref: "instrument",
  foreignField: "token",
});

watchlistSchema.set("toObject", { virtuals: true });
watchlistSchema.set("toJSON", { virtuals: true });

const watchlistModel = mongoose.model("watchlist", watchlistSchema);
module.exports = watchlistModel;
