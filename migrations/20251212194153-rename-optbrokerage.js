module.exports = {
  async up(db) {
    // Rename stockLTP → average in the orders collection
    await db.collection('clients').updateMany(
      { optbrokerage: { $exists: true } },
      { $rename: { optbrokerage: 'optBrokerage' } }
    );
  },

  async down(db) {
    // Revert change if needed
    await db.collection('orders').updateMany(
      { optBrokerage: { $exists: true } },
      { $rename: { optBrokerage: 'optbrokerage' } }
    );
  }
};
