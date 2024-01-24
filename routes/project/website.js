const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/website");

const router = Router();

router.use(verifyToken);

router.get("/:websiteId", findOne);
router.get("/", findAll);
router.get("/search/:searchValue", findAll);
router.post("/", saveOne);
router.patch("/:websiteId", updateOne);
router.delete("/:websiteId", deleteOne);

module.exports = router;
