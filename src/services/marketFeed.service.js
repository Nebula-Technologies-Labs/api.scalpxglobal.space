const axios = require("axios");
const InstrumentModel = require("../models/instruments.model");

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
  try {
    console.log("Saving Instruments in Database!!!");
    console.log(`${data.length} rows to be added in Database`);
    await InstrumentModel.deleteMany();
    const instruments = await InstrumentModel.insertMany(data);
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
