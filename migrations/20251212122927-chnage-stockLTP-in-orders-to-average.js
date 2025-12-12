module.exports = {
  async up(db) {
    // Rename stockLTP → average in the orders collection
    await db.collection('orders').updateMany(
      { stockLTP: { $exists: true } },
      { $rename: { stockLTP: 'average' } }
    );
  },

  async down(db) {
    // Revert change if needed
    await db.collection('orders').updateMany(
      { average: { $exists: true } },
      { $rename: { average: 'stockLTP' } }
    );
  }
};