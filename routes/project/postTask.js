const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/postTask");

const router = Router();

router.use(verifyToken);

router.get("/:taskId", findOne);
router.get("/", findAll);
router.get("/search/:searchValue", findAll);
router.post("/", saveOne);
router.patch("/:taskId", updateOne);
router.delete("/:taskId", deleteOne);

module.exports = router;
