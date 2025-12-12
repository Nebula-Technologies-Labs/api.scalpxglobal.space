module.exports = {
  async up(db) {
    await db.collection('orders').updateMany(
      {},
      { $unset: { orderMargin: "" } }
    );
  },

  async down(db) {
    // If you want to restore the field with null
    await db.collection('orders').updateMany(
      {},
      { $set: { orderMargin: null } }
    );
  }
};