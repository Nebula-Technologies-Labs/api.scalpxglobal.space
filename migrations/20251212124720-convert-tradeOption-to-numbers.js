module.exports = {
  async up(db) {
    // BUY → 1
    await db.collection('orders').updateMany(
      { tradeOption: "INTRADAY" },
      { $set: { tradeOption: 0 } }
    );

    // SELL → 0
    await db.collection('orders').updateMany(
      { tradeOption: "OVERNIGHT" },
      { $set: { tradeOption: 1 } }
    );
  },

  async down(db) {
    // Revert 1 → BUY
    await db.collection('orders').updateMany(
      { orderStatus: 1 },
      { $set: { orderStatus: "OVERNIGHT" } }
    );

    // Revert 0 → SELL
    await db.collection('orders').updateMany(
      { orderStatus: 0 },
      { $set: { orderStatus: "INTRADAY" } }
    );
  }
};