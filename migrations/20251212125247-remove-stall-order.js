module.exports = {
  async up(db) {
    await db.collection('orders').deleteMany({
      userId: null
    });
  },

  async down(db) {
    // Cannot restore deleted documents, so leave empty or log.
    console.log("No rollback for deleted documents.");
  }
};