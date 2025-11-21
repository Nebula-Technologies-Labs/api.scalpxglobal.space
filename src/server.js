require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./util/logger");
const { inject, errorHandler } = require("express-custom-error");
const routes = require("./routes/router");
const { initSocket } = require("./services/socket.service");
const { connectDatabase } = require("./util/database");
const cron = require("node-cron");
const {
  fetchedAndSaveInstrumentInDatabase,
} = require("./services/marketFeed.service");

// Creating server
const app = express();
const server = http.createServer(app);

// Initializing IO websocket
initSocket(server);

// Connecting Scalax Database which is running on localhost:PORT/scalax
connectDatabase();

// SmartApiSession is a global state which contains tokens fetched by generating session of SmartAPI which include : {jwtToken : "" , refreshToken : "" , feedToekn : ""}
// This SmartAPISession is use to get authenticate APIs feed
let SmartApiSession = {
  feedToken: null,
  expiry: null,
  jwtToken: null,
};

// Adding Helmet to enhance your API's security
app.use(helmet());

// Enabling CORS for all requests and origins
app.use(cors({ origin: "*" }));

// Using cookie parser to parse cookies from request headers
app.use(cookieParser());

// Using express json to parse JSON bodies into JS objects
app.use(express.json());

// Using express urlencoded to parse URL-encoded bodies into JS objects
app.use(express.urlencoded({ extended: true }));

// creating custom error handler middleware
app.use(errorHandler());
inject();

// creating logger middleware
app.use(logger.dev, logger.combined);

// Defining routes
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.status(200).json({ Message: "Scalax Server is running." });
});

// Handling undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Login and creating session of SmartAPI which contain session token
// After Successful session creation, connecting to the websocket feeds
const { smartApiLogin, connectFeed } = require("./services/smartApi.service");
// Initial login and WebSocket start
(async () => {
  try {
    const data = await smartApiLogin();
    SmartApiSession = {
      feedToken: data.feedToken,
      jwtToken: data.jwtToken,
      expiry: Date.now() + 55 * 60 * 1000, // 55 minutes from now
    };
    await connectFeed(SmartApiSession);
  } catch (err) {
    console.error("Initial SmartAPI Login Failed:", err);
  }
})();

// Refresh every 50 minutes and reconnect feed
cron.schedule("*/50 * * * *", async () => {
  try {
    console.log("🔁 Refreshing SmartAPI session and reconnecting feed...");
    const data = await smartApiLogin();
    SmartApiSession = {
      feedToken: data.feedToken,
      jwtToken: data.jwtToken,
      expiry: Date.now() + 55 * 60 * 1000,
    };

    // Reconnect feed with new session
    await connectFeed(SmartApiSession);
  } catch (err) {
    console.error("SmartAPI Refresh Failed:", err);
  }
});

// Server is listing on PORT:3000
server.listen(process.env.PORT, () => {
  console.log(`Scalax Server is running on ${process.env.PORT}`);
});

// Schedule cron job for 8:30 AM daily
// Fetching SmartAPI Market Data Every Morning at 8:30 AM
cron.schedule(
  "30 08 * * *",
  () => {
    console.log("Running daily job at 8:30 AM...");
    // Fetching Smart API Instruments and Save Instruments Data in Database
    fetchedAndSaveInstrumentInDatabase();
  },
  {
    timezone: "Asia/Kolkata",
  }
);
