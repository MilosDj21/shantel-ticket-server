const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/postRequest");

const router = Router();

router.use(verifyToken);

router.get("/:postRequestId", findOne);
router.get("/", findAll);
router.get("/search/:searchValue", findAll);
router.post("/", saveOne);
router.patch("/:postRequestId", updateOne);
router.delete("/:postRequestId", deleteOne);

module.exports = router;