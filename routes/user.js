const { Router } = require("express");
const { saveOne, updateOne, findAll, findOne, deleteOne } = require("../controllers/user");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const multerConf = require("../middlewares/multerConf");
const { userTicketRouter } = require("./techTicket");
const { userBonusTaskRouter } = require("./bonusTask");

const router = Router();

router.use(verifyToken);

router.get("/:userId", [isAdmin], findOne);
router.get("/", [isAdmin], findAll);
router.get("/search/:searchValue", [isAdmin], findAll);
router.post("/", [isAdmin, multerConf], saveOne);
router.patch("/", [isAdmin, multerConf], updateOne);
router.delete("/:userId", [isAdmin], deleteOne);

// routes for tickets from a single user, handled in techTicket routes
router.use("/:userId/techTickets", userTicketRouter);

// routes for bonus tasks from a single user, handled in bonusTasks routes
router.use("/:userId/bonusTasks", userBonusTaskRouter);

module.exports = router;
