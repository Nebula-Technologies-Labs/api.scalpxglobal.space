const {
  registerClientByAdmin,
  registerBrokerByAdmin,
  fetchAllBrokers,
  fetchAllClients,
  subscribeInstrument,
  unSubscribeInstrument,
  deleteClient,
  deletebroker,
} = require("../controllers/admin.controller");
const authenticate = require("../middleware/auth.middleware");
const router = require("express").Router();

router.post("/admin/register/client", authenticate, registerClientByAdmin);
router.post("/admin/register/broker", authenticate, registerBrokerByAdmin);
router.get("/admin/fetch/clients", authenticate, fetchAllClients);
router.get("/admin/fetch/brokers", authenticate, fetchAllBrokers);
router.delete("/admin/delete/client/:clientId", authenticate, deleteClient);
router.delete("/admin/delete/broker/:brokerId", authenticate, deletebroker);

router.post(
  "/admin/instrument/subscribe/:instrumentId",
  authenticate,
  subscribeInstrument
);
router.post(
  "/admin/instrument/unsubscribe/:instrumentId",
  authenticate,
  unSubscribeInstrument
);
router.get("/admin/instruments/subscribed");

module.exports = router;
