module.exports = {
  async up(db) {
    await db
      .collection("orders")
      .updateMany(
        {},
        { $set: { limit: null, triggerPrice: null, stoplossOption: null } }
      );
  },

  async down(db) {
    await db
      .collection("orders")
      .updateMany(
        {},
        { $unset: { limit: "", triggerPrice: "", stoplossOption: "" } }
      );
  },
};
