const expressAsyncHandler = require("express-async-handler");
const subscribeModel = require("../models/subscribe.model");
const watchlistModel = require("../models/watchlist.model");
const clientModel = require("../models/client.model");
const instrumentModel = require("../models/instruments.model");
const exchangeMapping = require("../util/exchangeMapping");

const addInstrumentToClientWatchlist = expressAsyncHandler(async (req, res) => {
  try {
    const { watchlistId } = req.params;
    const { token } = req.body;

    if (!watchlistId || !token)
      return res
        .status(400)
        .json({ message: "Missing WatchlistId or Token" });

    const client = await clientModel.findById(req.user);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const watchlist = await watchlistModel.findById(watchlistId);
    if (!watchlist)
      return res.status(404).json({ message: "Watchlist not found" });

    const instrument = await instrumentModel.findOne({token});
    if (!instrument)
      return res.status(404).json({ message: "Instrument not found" });

    // Ownership check
    if (watchlist.userId.toString() !== client._id.toString())
      return res.status(403).json({ message: "Unauthorized access" });

    // Prevent duplicates
    if (watchlist.instrumentId.includes(instrument.token))
      return res
        .status(409)
        .json({ message: "Instrument already in watchlist" });

    // Add instrument to watchlist
    watchlist.instrumentId.push(instrument.token);
    await watchlist.save();

    // Create subscription

    const isTokenExists = await subscribeModel.findOne({
      token: instrument.token,
    });

    if (isTokenExists) {
      return res.status(200).json({ message: "Instrument added to watchlist" });
    }

    const subscribe = await subscribeModel.create({
      token: instrument.token,
      exchangeType: exchangeMapping(instrument.exch_seg),
    });

    if (!subscribe) return res.status(400).json("Bad Request");
    return res.status(200).json({ message: "Instrument Added to watchlist" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const removeInstrumentfromClientWatchlist = expressAsyncHandler(
  async (req, res) => {
    const { watchlistId, token } = req.params;
    try {
      if (!watchlistId || !token)
        return res.status(404).json({ message: "Params Not found" });

      const client = await clientModel.findById(req.user);
      if (!client) return res.status(400).json({ message: "Bad Request" });

      const watchlist = await watchlistModel.findById(watchlistId);
      if (!watchlist) return res.status(404).json("Watchlist Not found");

      if (watchlist.userId.toString() !== client._id.toString())
        return res.status(401).json({ message: "UnAuthorized Access" });

      const instrument = await instrumentModel.findOne({token});
      if (!watchlist.instrumentId.includes(instrument.token))
        return res.status(400).json({ message: "Instrument not exists" });

      watchlist.instrumentId = watchlist.instrumentId.filter(
        (id) => id.toString() !== instrument.token.toString()
      );

      await watchlist.save();
      return res
        .status(200)
        .json({ message: "Instrument removed from Watchlist" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = {
  addInstrumentToClientWatchlist,
  removeInstrumentfromClientWatchlist,
};
