module.exports = {
  async up(db) {
    // BUY → 1
    await db.collection('orders').updateMany(
      {},
      { $set: { orderType: 0 } }
    );

    // Revert 0 → SELL
    await db.collection('orders').updateMany(
      {},
      { $set: { orderStatus: "" } }
    );
  }
};