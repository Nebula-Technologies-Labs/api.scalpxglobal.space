module.exports = {
  async up(db) {
    await db
      .collection("clients")
      .updateMany({}, { $set: { isAccountBlocked: false } });
  },

  async down(db) {
    await db
      .collection("clients")
      .updateMany({}, { $unset: { isAccountBlocked: "" } });
  },
};
