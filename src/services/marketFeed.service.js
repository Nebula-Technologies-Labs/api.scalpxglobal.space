const axios = require("axios");
const InstrumentModel = require("../models/instruments.model");
const { client } = require("./redis.service");
const { formatInstrumentArray } = require("../util/formatSymbol");

const fetchSmartAPIInstrumentsData = async () => {
  try {
    console.log("fetching Instruments...");
    const { data } = await axios.get(
      "https://margincalculator.angelone.in/OpenAPI_File/files/OpenAPIScripMaster.json"
    );
    console.log(data.length + " Instruments fetched");
    console.log(data[0]);
    console.log("Instruments Successfully fetched!!!");
    return data;
  } catch (error) {
    return new Error("SmartAPI Instruments fetched failed...");
  }
};

const saveNewInstrumentsInDatabase = async (data) => {
  const instrumentTypes = ["OPTSTK", "OPTIDX", "OPTFUT", "FUTCOM"];
  try {
    console.log("Saving Instruments in Database!!!");
    console.log(`${data.length} rows to be added in Database`);
    await InstrumentModel.deleteMany();
    const formattedInstruments = formatInstrumentArray(data);
    await InstrumentModel.insertMany(formattedInstruments);
    const instruments = await InstrumentModel.find({
      instrumenttype: { $in: instrumentTypes },
    }).select("symbol token exch_seg");
    await client.set("instruments", JSON.stringify(instruments));
    console.log(`${instruments.length} rows added in Database`);
  } catch (error) {
    throw Error(error);
  }
};

const fetchedAndSaveInstrumentInDatabase = async () => {
  const data = await fetchSmartAPIInstrumentsData();
  await saveNewInstrumentsInDatabase(data);
};

module.exports = { fetchedAndSaveInstrumentInDatabase };
