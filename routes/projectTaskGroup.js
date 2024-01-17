const { Router } = require("express");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../controllers/project/projectTaskGroup");

const router = Router({ mergeParams: true });

router.get("/:taskGroupId", findOne);
router.get("/", findAll);
router.post("/", saveOne);
router.patch("/:taskGroupId", updateOne);
router.delete("/:taskGroupId", deleteOne);

module.exports = router;
