
module.exports = {
  async up(db) {
    await db
      .collection("clients")
      .updateMany({}, { $set: { optMargin: 5 } });
  },

  async down(db) {
    await db
      .collection("clients")
      .updateMany({}, { $unset: { optMargin: "" } });
  },
};