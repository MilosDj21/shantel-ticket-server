const { Router } = require("express");
const { saveOne, updateOne, findAll, findOne, deleteOne } = require("../controllers/user");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const multerConf = require("../middlewares/multerConf");
const { userTicketRouter } = require("./tech-ticket/techTicket");
const { userProjectRouter } = require("./project/project");
const { taskViewRouter: taskRouter } = require("./project/projectTask");

const router = Router();

router.use(verifyToken);

router.get("/:userId", [isAdmin], findOne);
router.get("/", [isAdmin], findAll);
router.get("/search/:searchValue", [isAdmin], findAll);
router.post("/", [isAdmin, multerConf], saveOne);
router.patch("/:userId", [isAdmin, multerConf], updateOne);
router.delete("/:userId", [isAdmin], deleteOne);

// routes for tickets from a specific user, handled in techTicket routes
router.use("/:userId/techTickets", userTicketRouter);

module.exports = router;
