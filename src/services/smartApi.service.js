const { SmartAPI, WebSocketV2 } = require("smartapi-javascript");
const { generateTotp } = require("../util/generateTotp");
const SubscribeModel = require("../models/subscribe.model");
const { Io } = require("./socket.service");
const { client } = require("../services/redis.service");
const exchangeMapping = require("../util/exchangeMapping");

const smartApi = new SmartAPI({
  api_key: process.env.SMART_API_KEY,
});

const io = Io();
let ws;
const tickMap = new Map();
let subscribeInstrument = [];

const smartApiLogin = async () => {
  try {
    const totp = await generateTotp();
    const session = await smartApi.generateSession(
      process.env.SMART_API_CLIENT_ID,
      process.env.SMART_API_CLIENT_PASSWORD,
      totp
    );
    return session.data;
  } catch (error) {
    console.error("Smart Api Login Failed : ", error);
  }
};

// -------- WebSocket Connection Function --------
const connectFeed = async (session) => {
  try {
    if (ws) {
      try {
        ws.close();
      } catch (e) {
        console.warn("Old WebSocket close failed:", e.message);
      }
    }
    // Initialize WebSocket
    ws = new WebSocketV2({
      jwttoken: session.jwtToken,
      apikey: process.env.SMART_API_KEY,
      clientcode: process.env.SMART_API_CLIENT_ID,
      feedtype: session.feedToken,
    });

    await ws.connect();
    ws.on("tick", (data) => {
      if (data === "pong") return;
      const token = String(data.token).replace(/"/g, "").trim();
      tickMap.set(token, { ...data, token });
      console.log(data);
      const tickObject = Object.fromEntries(tickMap);
      io.emit("tick", tickObject);
    });

    ws.on("error", (err) => console.error("WebSocket Error:", err));
    ws.on("close", () => console.log("⚠️ WebSocket closed — reconnecting..."));
  } catch (error) {
    console.error("❌ Connect Feed Failed:", error);
  }
};

// -------- Socket.IO Connection (Global Scope) --------
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  socket.on("subscribe", ({ token, exchangeType }) => {
    try {
      const payload = {
        correlationID: "correlation_id",
        action: 1,
        mode: 2,
        exchangeType: exchangeMapping(exchangeType),
        tokens: [token],
      };
      ws.fetchData(payload);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// -------- Helper Function --------
function subscribeToInstruments(ws, instruments) {
  if (!ws) {
    console.error("WebSocket not initialized");
    return;
  }

  const payloads = instruments.map((item) => ({
    correlationID: "correlation_id",
    action: 1,
    mode: 2,
    exchangeType: item.exchangeType,
    tokens: [item.token],
  }));

  console.log(`📡 Subscribed to ${instruments.length} instruments`);
  payloads.forEach((p) => ws.fetchData(p));
}

module.exports = { smartApi, smartApiLogin, connectFeed, tickMap };
