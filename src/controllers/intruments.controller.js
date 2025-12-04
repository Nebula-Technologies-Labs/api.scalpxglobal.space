const expressAsyncHandler = require("express-async-handler");
const instrumentModel = require("../models/instruments.model");
const {client} = require("../services/redis.service")

const fetchAllInstruments = expressAsyncHandler(async (req, res) => {
  const instrumentTypes = ["OPTSTK", "OPTIDX", "OPTFUT", "FUTCOM"];
  try {
    const data = await client.get("instruments");
    if (data) {
      return res.status(200).json({ instruments: JSON.parse(data) });
    }
    const instruments = await instrumentModel
      .find({
        instrumenttype: { $in: instrumentTypes },
      })
      .select("symbol token exch_seg");
    return res.status(200).json({ instruments });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const fetchIndicesIntruments = expressAsyncHandler(async (req, res) => {
  const IndicesInstruments = ["NIFTY", "BANKNIFTY"];
  const instrumenttype = "AMXIDX";
  try {
    const instruments = await Promise.all(
      IndicesInstruments.map(async (item) => {
        return await instrumentModel.findOne({ name: item, instrumenttype });
      })
    );
    return res.status(200).json({ instruments });
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
});

const fetchInstrumentById = expressAsyncHandler(async (req, res) => {
  try {
    const { tokenId } = req.params;
    if (!tokenId) return res.status(403).json({ message: "Bad Request" });
    const instrument = await instrumentModel.findOne({ token: tokenId });
    return res.status(200).json({ instrument });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  fetchAllInstruments,
  fetchIndicesIntruments,
  fetchInstrumentById,
};
