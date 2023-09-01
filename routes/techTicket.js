const { Router } = require("express");
const { findOne, findAll, saveOne, updateOne, deleteOne, findOneByUser, findAllByUser, saveOneByUser, updateOneByUser, deleteOneByUser } = require("../controllers/techTicket");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// routes for all tickets, only admin can access them directly
const router = Router();

router.use(verifyToken);
router.use(isAdmin);

router.get("/:ticketId", findOne);
router.get("/", findAll);
router.post("/", saveOne);
router.patch("/", updateOne);
router.delete("/:ticketId", deleteOne);

// routes for user tickets
const userTicketRouter = Router({ mergeParams: true });

userTicketRouter.get("/:ticketId", findOneByUser);
userTicketRouter.get("/", findAllByUser);
userTicketRouter.post("/", saveOneByUser);

const ticketRouter = (module.exports = router);
ticketRouter.userTicketRouter = userTicketRouter;
