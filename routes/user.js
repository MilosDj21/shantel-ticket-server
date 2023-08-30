const { Router } = require("express");
const { saveOne, findAll } = require("../controllers/user");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const multerConf = require("../middlewares/multerConf");

const router = Router();

router.use(verifyToken);
router.use(isAdmin);
router.use(multerConf);

router.post("/", saveOne);
router.get("/", findAll);

module.exports = router;
