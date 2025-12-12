const { SmartAPI, WebSocketV2 } = require("smartapi-javascript");
const { generateTotp } = require("../util/generateTotp");
const { Io } = require("./socket.service");
const exchangeMapping = require("../util/exchangeMapping");
const { redis } = require("./redis.service");

const smartApi = new SmartAPI({
  api_key: process.env.SMART_API_KEY,
});

const io = Io();
let ws;
const tickMap = new Map();
let tokenMap = new Map();

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

    tokenMap = await loadTokenMap();
    tokenMap.set("99926000", { token: "99926000", exchangeType: "NSE" });
    tokenMap.set("99926009", { token: "99926009", exchangeType: "NSE" });

    await ws.connect();
    subscribeInstrument(tokenMap);
    ws.on("tick", (data) => {
      if (data === "pong") return;
      const token = String(data.token).replace(/"/g, "").trim();
      tickMap.set(token, { ...data, token });
    });

    setInterval(() => {
      io.emit("tick", Object.fromEntries(tickMap));
    }, [100]);

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
    if (!tokenMap.has(token)) {
      try {
        const payload = {
          correlationID: "correlation_id",
          action: 1,
          mode: 2,
          exchangeType: exchangeMapping(exchangeType),
          tokens: [token],
        };
        ws.fetchData(payload);
        tokenMap.set(token, { token, exchangeType });
        saveToken(token, exchangeType);
      } catch (error) {
        console.error(error);
      }
    }
  });
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const subscribeInstrument = (tokenMap) => {
  const tokenArray = Array.from(tokenMap.values());
  tokenArray.forEach((item) => {
    const payload = {
      correlationID: "correlation_id",
      action: 1,
      mode: 2,
      exchangeType: exchangeMapping(item.exchangeType),
      tokens: [item.token],
    };
    ws.fetchData(payload);
  });
};

const saveToken = async (token, exchangeType) => {
  return await redis.HSET(`tokenMap:${token}`, {
    token,
    exchangeType,
  });
};

const loadTokenMap = async () => {
  const keys = await redis.keys("tokenMap:*");
  const map = new Map();

  for (const key of keys) {
    const data = await redis.HGETALL(key);
    map.set(data.token, data);
  }

  return map;
};

module.exports = { smartApi, smartApiLogin, connectFeed, tickMap };
