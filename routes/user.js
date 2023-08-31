const { Router } = require("express");
const { saveOne, updateOne, findAll, findOne } = require("../controllers/user");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const multerConf = require("../middlewares/multerConf");

const router = Router();

router.use(verifyToken);
router.use(isAdmin);
router.use(multerConf);

router.get("/:userId", findOne);
router.get("/", findAll);
router.post("/", saveOne);
router.patch("/", updateOne);

module.exports = router;
