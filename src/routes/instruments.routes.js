const router = require("express").Router();
const {
  fetchAllInstruments,
  fetchIndicesIntruments,
  fetchInstrumentById,
} = require("../controllers/intruments.controller");

const Authenticate = require("../middleware/auth.middleware");

router.get("/instruments/fetch/indices", Authenticate, fetchIndicesIntruments);
router.get("/instruments/fetch", Authenticate, fetchAllInstruments);
router.get("/instrument/search?q",Authenticate)
router.get("/instrument/:tokenId", Authenticate, fetchInstrumentById);

module.exports = router;
