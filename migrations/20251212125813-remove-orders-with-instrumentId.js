module.exports = {
  async up(db) {
    await db.collection('orders').deleteMany({
      instrumentId: { $exists: true }
    });
  },

  async down(db) {
    // Can't restore deleted documents
    console.log("No rollback possible for deleted orders.");
  }
};