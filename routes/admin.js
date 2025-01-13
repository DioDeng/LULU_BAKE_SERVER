var express = require("express");
var router = express.Router();
const AdminControllers = require("../controllers/admins");
const handErrorAsync = require("../service/handErrorAsync");
const { isAdmin } = require("../middleware/auth");

router.post("/admin/sign_up", handErrorAsync(AdminControllers.signUp));
router.post("/admin/sign_in", handErrorAsync(AdminControllers.signIn));
router.patch("/admin/updatePassword", isAdmin, handErrorAsync(AdminControllers.updatePassword));

module.exports = router;