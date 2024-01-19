const { Router } = require("express");
<<<<<<<< HEAD:routes/project/projectTaskMessage.js
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/project/projectTaskMessage");
========
const { findOne, findAll, saveOne, updateOne, deleteOne } = require("../../controllers/tech-ticket/techTicketMessage");
>>>>>>>> 24a8a15 (merged origin main):routes/tech-ticket/techTicketMessage.js
const multerConf = require("../../middlewares/multerConf");

const router = Router({ mergeParams: true });

router.use(multerConf);

router.get("/:messageId", findOne);
router.get("/", findAll);
router.post("/", saveOne);
router.patch("/:messageId", updateOne);
router.delete("/:messageId", deleteOne);

module.exports = router;
