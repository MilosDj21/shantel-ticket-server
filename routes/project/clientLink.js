const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/clientLink");

const router = Router();

router.use(verifyToken);

router.get("/:linkId", findOne);
router.get("/", findAll);
router.get("/search/:searchValue", findAll);
router.post("/", saveOne);
router.patch("/:linkId", updateOne);
router.delete("/:linkId", deleteOne);

module.exports = router;
