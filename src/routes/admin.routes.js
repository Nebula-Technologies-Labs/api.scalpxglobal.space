const {
  registerClientByAdmin,
  registerBrokerByAdmin,
  fetchAllBrokers,
  fetchAllClients,
  deleteClient,
  deletebroker,
  fetchAllOrders,
} = require("../controllers/admin.controller");
const authenticate = require("../middleware/auth.middleware");
const router = require("express").Router();

router.post("/admin/register/client", authenticate, registerClientByAdmin);
router.post("/admin/register/broker", authenticate, registerBrokerByAdmin);
router.get("/admin/fetch/clients", authenticate, fetchAllClients);
router.get("/admin/fetch/brokers", authenticate, fetchAllBrokers);
router.get("/admin/fetch/orders", authenticate, fetchAllOrders);
router.delete("/admin/delete/client/:clientId", authenticate, deleteClient);
router.delete("/admin/delete/broker/:brokerId", authenticate, deletebroker);

module.exports = router;
