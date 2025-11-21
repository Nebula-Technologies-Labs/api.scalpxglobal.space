const router = require("express").Router();
const {
  addInstrumentToClientWatchlist,
  removeInstrumentfromClientWatchlist,
} = require("../controllers/watchlist.controller");
const Authenticate = require("../middleware/auth.middleware");

router.put(
  "/watchlist/:watchlistId/instrument",
  Authenticate,
  addInstrumentToClientWatchlist
);
router.put(
  "/watchlist/:watchlistId/instrument/:instrumentId",
  Authenticate,
  removeInstrumentfromClientWatchlist
);

module.exports = router;
