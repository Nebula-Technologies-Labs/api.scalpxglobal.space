const { SmartAPI, WebSocketV2 } = require("smartapi-javascript");
const { generateTotp } = require("../util/generateTotp");
const SubscribeModel = require("../models/subscribe.model");
const { Io } = require("./socket.service");
const { client } = require("./redis.service");
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
    console.log("✅ SmartAPI WebSocket Connected");

    // Subscribe to initial instruments
    subscribeInstrument = await SubscribeModel.find();
    subscribeToInstruments(ws, subscribeInstrument);

    // WebSocket Tick Listener
    ws.on("tick", (data) => {
      if (data === "pong") return;

      const cleanToken = String(data.token).replace(/"/g, "").trim();
      tickMap.set(cleanToken, { ...data, token: cleanToken });
      // convert Map → object once
      const obj = Object.fromEntries(tickMap);
      io.emit("tick", obj);
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
  const obj = Object.fromEntries(tickMap);
  io.emit("tick", obj);
  socket.on("instrument:view", async ({ token, exchangeType }) => {
    try {
      await client.sAdd(
        "subscribe_temp",
        JSON.stringify({ token, exchangeType: exchangeMapping(exchangeType) })
      );
      const raw = await client.sMembers("subscribe_temp");
      const instruments = raw.map(JSON.parse);
      subscribeToInstruments(ws, instruments);
    } catch (error) {
      console.log("Socket instrument:view error", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// -------- Helper Function --------
async function subscribeToInstruments(ws, instruments) {
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
