const router = require("express").Router();
const {
  createClientWatchlist,
  deleteClientWatchlistById,
  fetchClientWatchlist,
  fetchClientsWatchlistById,
  updateClientWatchlistById,
  getClientProfile,
  createNewOrder,
  fetchClientPosition
} = require("../controllers/client.controller");
const Authenticate = require("../middleware/auth.middleware");

router.get("/client/", Authenticate, getClientProfile);

// --------------------- Client Watchlists Routes ----------------------------
router.post("/client/watchlist", Authenticate, createClientWatchlist);
router.get("/client/watchlist/", Authenticate, fetchClientWatchlist);
router.get(
  "/client/watchlist/:watchlistId",
  Authenticate,
  fetchClientsWatchlistById
);
router.put(
  "/client/watchlist/:watchlistId",
  Authenticate,
  updateClientWatchlistById
);
router.delete(
  "/client/watchlist/:watchlistId",
  Authenticate,
  deleteClientWatchlistById
);

// -------------------- Client Orders Routes ------------------------------------

router.post("/client/order", Authenticate, createNewOrder);
router.get("/client/position" , Authenticate, fetchClientPosition)
module.exports = router;
