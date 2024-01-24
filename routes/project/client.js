const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/client");

const router = Router();

router.use(verifyToken);

router.get("/:clientId", findOne);
router.get("/", findAll);
router.get("/search/:searchValue", findAll);
router.post("/", saveOne);
router.patch("/:clientId", updateOne);
router.delete("/:clientId", deleteOne);

module.exports = router;
