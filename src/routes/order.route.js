const router = require("express").Router();
const {
  fetchOrderById,
  fetchClientOrders,
  createNewOrder
} = require("../controllers/order.controller");
const Authenticate = require("../middleware/auth.middleware");

router.get("/order", Authenticate, fetchClientOrders);
router.get("/order/:orderId", Authenticate, fetchOrderById);
router.post("/order" , Authenticate, createNewOrder)

module.exports = router;
