const { Router } = require("express");
const { findOne, findAll, saveOne, updateOne, deleteOne, findOneByUser, findAllByUser, saveOneByUser, updateOneByUser } = require("../../controllers/tech-ticket/techTicket");
const { verifyToken, isAdmin } = require("../../middlewares/auth");
const ticketMessageRouter = require("./techTicketMessage");
const ticketLogRouter = require("./techTicketLog");

// routes for all tickets, only admin can access them directly
const adminTicketRouter = Router();
adminTicketRouter.use(verifyToken);
adminTicketRouter.get("/:ticketId", [isAdmin], findOne);
adminTicketRouter.get("/", [isAdmin], findAll);
adminTicketRouter.get("/search/:searchValue", [isAdmin], findAll);
adminTicketRouter.post("/", [isAdmin], saveOne);
adminTicketRouter.patch("/", [isAdmin], updateOne);
adminTicketRouter.delete("/:ticketId", [isAdmin], deleteOne);
//routes for ticket messages, they are accessed from ticket, so user don't need to be checked
adminTicketRouter.use("/:ticketId/ticketMessage", ticketMessageRouter);
//routes for ticket logs, they are accessed from ticket, so user don't need to be checked
adminTicketRouter.use("/:ticketId/ticketLog", ticketLogRouter);

// routes for user tickets
const userTicketRouter = Router({ mergeParams: true });
userTicketRouter.get("/:ticketId", findOneByUser);
userTicketRouter.get("/", findAllByUser);
userTicketRouter.get("/search/:searchValue", findAllByUser);
userTicketRouter.post("/", saveOneByUser);
userTicketRouter.patch("/", updateOneByUser);

module.exports = { adminTicketRouter, userTicketRouter };
