const { Router } = require("express");
const { findOne, findAllByTicket, saveOne, updateOne, deleteOne } = require("../../controllers/tech-ticket/techTicketLog");

const router = Router({ mergeParams: true });

router.get("/:logId", findOne);
router.get("/", findAllByTicket);
router.post("/", saveOne);
router.patch("/", updateOne);
router.delete("/:logId", deleteOne);

module.exports = router;
