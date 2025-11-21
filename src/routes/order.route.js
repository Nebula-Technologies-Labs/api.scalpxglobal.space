const router = require("express").Router();
const {
  fetchAllClientOrders,
  fetchOrderById,
} = require("../controllers/order.controller");
const Authenticate = require("../middleware/auth.middleware");

router.get("/order", Authenticate, fetchAllClientOrders);
router.get("/order/:orderId", Authenticate, fetchOrderById);

module.exports = router;
