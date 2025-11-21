const {
  registerClient,
  registerBroker,
  fetchAllBrokers,
  fetchAllClients,
  fetchSubscribedInstruments,
  subscribeInstrument,
  unSubscribeInstrument,
} = require("../controllers/admin.controller");
const authenticate = require("../middleware/auth.middleware");
const router = require("express").Router();

router.post("/admin/register/client", authenticate, registerClient);
router.post("/admin/register/broker", authenticate, registerBroker);
router.get("/admin/fetch/clients", authenticate, fetchAllClients);
router.get("/admin/fetch/brokers", authenticate, fetchAllBrokers);

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
