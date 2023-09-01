const { Router } = require("express");
const { saveOne, updateOne, findAll, findOne } = require("../controllers/user");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const multerConf = require("../middlewares/multerConf");
const { userTicketRouter } = require("./techTicket");

const router = Router();

router.use(verifyToken);

router.get("/:userId", [isAdmin, multerConf], findOne);
router.get("/", [isAdmin, multerConf], findAll);
router.post("/", [isAdmin, multerConf], saveOne);
router.patch("/", [isAdmin, multerConf], updateOne);

// routes for tickets from a single user, handled in techTicket routes
router.use("/:userId/techTickets", userTicketRouter);

module.exports = router;
