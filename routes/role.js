const { Router } = require("express");
const { findAll, findOne } = require("../controllers/role");
const { verifyToken, isAdmin } = require("../middlewares/auth");

const router = Router();

router.use(verifyToken);
// router.use(isAdmin);

router.get("/:roleId", findOne);
router.get("/", findAll);

module.exports = router;
