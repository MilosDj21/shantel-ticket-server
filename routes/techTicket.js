const { Router } = require("express");
const { findOne, findAll, saveOne, updateOne, deleteOne, findOneByUser, findAllByUser, saveOneByUser } = require("../controllers/techTicket");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const ticketMessageRouter = require("./techTicketMessage");

const router = Router();

router.use(verifyToken);

// routes for all tickets, only admin can access them directly
router.get("/:ticketId", [isAdmin], findOne);
router.get("/", [isAdmin], findAll);
router.post("/", [isAdmin], saveOne);
router.patch("/", [isAdmin], updateOne);
router.delete("/:ticketId", [isAdmin], deleteOne);

//routes for ticket messages, they are accessed from ticket, so user don't need to be checked
router.use("/:ticketId/ticketMessage", ticketMessageRouter);

// routes for user tickets
const userTicketRouter = Router({ mergeParams: true });

userTicketRouter.get("/:ticketId", findOneByUser);
userTicketRouter.get("/", findAllByUser);
userTicketRouter.post("/", saveOneByUser);

const ticketRouter = (module.exports = router);
ticketRouter.userTicketRouter = userTicketRouter;
