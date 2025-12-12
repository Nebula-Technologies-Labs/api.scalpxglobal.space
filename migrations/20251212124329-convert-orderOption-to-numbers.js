module.exports = {
  async up(db) {
    // BUY → 1
    await db.collection('orders').updateMany(
      { orderOption: "MARKET" },
      { $set: { orderOption: 0 } }
    );

    // SELL → 0
    await db.collection('orders').updateMany(
      { orderOption: "LIMIT" },
      { $set: { orderOption: 1 } }
    );
  },

  async down(db) {
    // Revert 1 → BUY
    await db.collection('orders').updateMany(
      { orderStatus: 1 },
      { $set: { orderStatus: "LIMIT" } }
    );

    // Revert 0 → SELL
    await db.collection('orders').updateMany(
      { orderStatus: 0 },
      { $set: { orderStatus: "MARKET" } }
    );
  }
};