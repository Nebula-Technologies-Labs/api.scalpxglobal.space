const {
  loginAdminUser,
  loginBrokerUser,
  loginClientUser,
} = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/auth/admin/login", loginAdminUser);
router.post("/auth/client/login", loginClientUser);
router.post("/auth/broker/login", loginBrokerUser);

module.exports = router;
