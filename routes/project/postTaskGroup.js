const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/postTaskGroup");

const router = Router();

router.use(verifyToken);

router.get("/:taskGroupId", findOne);
router.get("/", findAll);
router.post("/", saveOne);
router.patch("/:taskGroupId", updateOne);
router.delete("/:taskGroupId", deleteOne);

module.exports = router;
