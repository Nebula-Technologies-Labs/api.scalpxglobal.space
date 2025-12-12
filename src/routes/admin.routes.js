const {
  registerClientByAdmin,
  registerBrokerByAdmin,
  fetchAllBrokers,
  fetchAllClients,
  deleteClient,
  deletebroker,
  fetchAllOrders,
  fetchClientById,
  blockClientAccount,
  unblockClientAccount
} = require("../controllers/admin.controller");
const authenticate = require("../middleware/auth.middleware");
const router = require("express").Router();

router.post("/admin/register/client", authenticate, registerClientByAdmin);
router.post("/admin/register/broker", authenticate, registerBrokerByAdmin);
router.get("/admin/fetch/clients", authenticate, fetchAllClients);
router.get("/admin/fetch/client/:clientId", authenticate, fetchClientById);
router.get("/admin/fetch/brokers", authenticate, fetchAllBrokers);
router.get("/admin/fetch/orders", authenticate, fetchAllOrders);
router.delete("/admin/delete/client/:clientId", authenticate, deleteClient);
router.delete("/admin/delete/broker/:brokerId", authenticate, deletebroker);
router.put("/admin/client/block/:clientId", authenticate, blockClientAccount);
router.put("/admin/client/unblock/:clientId", authenticate, unblockClientAccount);

module.exports = router;
