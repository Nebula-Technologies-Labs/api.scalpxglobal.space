module.exports = {
  async up(db) {
    // BUY → 1
    await db.collection('orders').updateMany(
      {},
      { $set: { orderStatus: 1 } }
    );
  },

  async down(db) {
    // Revert 1 → BUY
    await db.collection('orders').updateMany(
      { },
      { $set: { orderStatus: "" } }
    );
  }
};