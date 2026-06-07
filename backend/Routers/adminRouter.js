const express = require("express");
const { checkToken: Auth } = require("../middlewares/authentication");
const { AdminAuth } = require("../utils/guards");
const { getVendor, deleteVendor, Login, Register } = require("../Controllers/adminController");

const router = express.Router();

router.route("/login").post(Login);
router.route("/register").post(Register);

// Admin-only vendor management
router.route("/getvendors").get(Auth, AdminAuth, getVendor);
router.route("/deletevendors/:vendorId").delete(Auth, AdminAuth, deleteVendor);

module.exports = router;
