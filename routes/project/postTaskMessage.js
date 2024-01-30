const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const multerConf = require("../../middlewares/multerConf");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/postTaskMessage");

const router = Router();

router.use(verifyToken);
router.use(multerConf);

router.get("/:messageId", findOne);
router.get("/", findAll);
router.post("/", saveOne);
router.patch("/:messageId", updateOne);
router.delete("/:messageId", deleteOne);

module.exports = router;
