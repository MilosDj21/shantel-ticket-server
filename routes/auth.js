const { Router } = require("express");
const { login, logout } = require("../controllers/auth");

const router = Router();

router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
