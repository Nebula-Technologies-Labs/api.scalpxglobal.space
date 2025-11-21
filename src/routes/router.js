const AuthRoutes = require("./auth.routes");
const AdminRoutes = require("./admin.routes");
const InstrumentsRoutes = require("./instruments.routes");
const ClientRoutes = require("./client.routes");
const WatchlistRoutes = require("./watchlist.routes");
const OrderRoutes = require("./order.route");
const router = require("express").Router();

router.use(AuthRoutes);
router.use(AdminRoutes);
router.use(InstrumentsRoutes);
router.use(ClientRoutes);
router.use(WatchlistRoutes);
router.use(OrderRoutes);

module.exports = router;
