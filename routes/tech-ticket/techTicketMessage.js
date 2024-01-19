const { Router } = require("express");
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/tech-ticket/techTicketMessage");

const multerConf = require("../../middlewares/multerConf");

const router = Router({ mergeParams: true });
router.use(multerConf);
router.get("/:messageId", findOne);
router.get("/", findAll);
router.post("/", saveOne);
router.patch("/:messageId", updateOne);
router.delete("/:messageId", deleteOne);

module.exports = router;
