const expressAsyncHandler = require("express-async-handler");
const watchlistModel = require("../models/watchlist.model");
const clientModel = require("../models/client.model");
const instrumentModel = require("../models/instruments.model");
const orderModel = require("../models/order.model");

const getClientProfile = expressAsyncHandler(async (req, res) => {
  try {
    const client = await clientModel
      .findById(req.user)
      .populate("brokerId", "userName userId")
      .populate("watchlists")
      .populate({
        path: "watchlists",
        populate: {
          path: "instruments",
        },
      })
      .select("-password");
    if (!client) return res.status(404).json({ message: "client not found" });

    return res.status(200).json({ client });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Insternal Server Error" });
  }
});

//  --------------------- Client Watchlists Controllers ----------------------------

const createClientWatchlist = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Bad Request" });
    const client = await clientModel.findById(req.user);
    if (!client) return res.status(400).json({ message: "Bad Request" });
    const isWatchlistPresent = await watchlistModel.findOne({
      userId: client._id,
      name,
    });
    if (isWatchlistPresent)
      return res.status(409).json({ message: "Watchlist Already Exists" });

    const watchlist = await watchlistModel.create({ name, userId: req.user });
    client.watchlists.push(watchlist._id);
    await client.save();
    return res.status(200).json({ message: "Watchlist Created", watchlist });
  } catch (error) {
    return res.status(400).json({ message: "Bad Request" });
  }
});

const fetchClientWatchlist = expressAsyncHandler(async (req, res) => {
  try {
    const watchlist = await watchlistModel
      .find({ userId: req.user })
      .populate("instrumentId");
    return res.status(200).json({ watchlist });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const fetchClientsWatchlistById = expressAsyncHandler(async (req, res) => {
  try {
    const { watchlistId } = req.params;
    const watchlist = await watchlistModel
      .findById(watchlistId)
      .populate("instrumentId");
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }
    return res.status(200).json({ watchlist });
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
});

const deleteClientWatchlistById = expressAsyncHandler(async (req, res) => {
  try {
    const { watchlistId } = req.params;
    const client = await clientModel.findById(req.user);
    if (!client) return res.status(400).json({ message: "Bad Request" });
    const watchlist = await watchlistModel.findById(watchlistId);
    if (!watchlist) {
      return res.status(400).json({ message: "Bad Request" });
    }

    if (watchlist.userId.toString() !== client._id.toString()) {
      return res.status(401).json({ message: "UnAuthorized Access" });
    }
    await watchlist.deleteOne();

    client.watchlists = client.watchlists.filter((id) => {
      id.toString() !== watchlist._id;
    });
    await client.save();
    client.watchlists.pop(watchlist._id);
    return res.status(200).json({ message: "Watchlist Deleted" });
  } catch (error) {
    return res.status(401).json({ message: "Bad request" });
  }
});

const updateClientWatchlistById = expressAsyncHandler(async (req, res) => {
  try {
    const { watchlistId } = req.params;
    const { name } = req.body;
    if (!name) return res.status(404).json({ message: "Body not found" });
    const client = await clientModel.findById(req.user);
    const watchlist = await watchlistModel.findById(watchlistId);
    if (!watchlist)
      return res.status(404).json({ messgae: "Watchlist not found" });
    if (watchlist.userId.toString() !== client._id.toString()) {
      return res.status(401).json({ message: "UnAuthorized Access" });
    }
    await watchlist.updateOne({ name });
    return res.status(200).json({ message: "Watchlist Updated" });
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
});

// -------------------- Client Orders Controllers -------------------------------

const createNewOrder = expressAsyncHandler(async (req, res) => {
  try {
    const { token, quantity } = req.body;
    const instrument = await instrumentModel.findOne({ token });
    const client = await clientModel.findById(req.user);

    if (!token || !quantity || !instrument || !client || !quantity) {
      return res.status(403).json({ message: "Failed to place order." });
    }

    const order = await orderModel.create({
      brokerage: client.brokeragePercentage,
      expiry: instrument.expiry,
      segment: instrument.exch_seg,
      buyPrice: client.futureMargin,
      instrumentType: instrument.instrumenttype,
      name: instrument.name,
      symbol: instrument.symbol,
      quantity: quantity,
      userId: client._id,
      token: token,
      brokerId: client.brokerId,
      brokerModelType: client.brokerModelType,
    });
    client.orderId.push(order._id);
    await client.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal Server Error" });
  }
});

module.exports = {
  getClientProfile,
  createClientWatchlist,
  fetchClientWatchlist,
  deleteClientWatchlistById,
  updateClientWatchlistById,
  fetchClientWatchlist,
  fetchClientsWatchlistById,
  createNewOrder
};
