module.exports = {
  async up(db) {
    // BUY → 1
    await db.collection('orders').updateMany(
      { orderStatus: "BUY" },
      { $set: { orderStatus: 1 } }
    );

    // SELL → 0
    await db.collection('orders').updateMany(
      { orderStatus: "SELL" },
      { $set: { orderStatus: 0 } }
    );
  },

  async down(db) {
    // Revert 1 → BUY
    await db.collection('orders').updateMany(
      { orderStatus: 1 },
      { $set: { orderStatus: "BUY" } }
    );

    // Revert 0 → SELL
    await db.collection('orders').updateMany(
      { orderStatus: 0 },
      { $set: { orderStatus: "SELL" } }
    );
  }
};