const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/project");

const router = Router();

router.use(verifyToken);

router.get("/:projectId", findOne);
router.get("/", findAll);
router.get("/search/:searchValue", findAll);
router.post("/", saveOne);
router.patch("/:projectId", updateOne);
router.delete("/:projectId", deleteOne);

module.exports = router;
