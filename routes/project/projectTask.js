const { Router } = require("express");
const { verifyToken, isAdmin } = require("../../middlewares/auth");
const {
  adminFindOne,
  adminFindAll,
  adminSaveOne,
  adminUpdateOne,
  adminDeleteOne,
  taskViewFindOne,
  taskViewFindAll,
  taskViewSaveOne,
  taskViewUpdateOne,
  taskViewDeleteOne,
  projectViewFindOne,
  projectViewFindAll,
  projectViewSaveOne,
  projectViewUpdateOne,
  projectViewDeleteOne,
} = require("../../controllers/project/projectTask");
const messageRouter = require("./projectTaskMessage");

// routes for all tasks, only admin can access them directly
const adminTaskRouter = Router();
adminTaskRouter.use(verifyToken);
adminTaskRouter.get("/:taskId", [isAdmin], adminFindOne);
adminTaskRouter.get("/", [isAdmin], adminFindAll);
adminTaskRouter.get("/search/:searchValue", [isAdmin], adminFindAll);
adminTaskRouter.post("/", [isAdmin], adminSaveOne);
adminTaskRouter.patch("/", [isAdmin], adminUpdateOne);
adminTaskRouter.delete("/:taskId", [isAdmin], adminDeleteOne);
//routes for task messages, handled in projectTaskMessage routes
adminTaskRouter.use("/:taskId/taskMessages", messageRouter);

// this router is used to handle requests from user tasks view, because not all users have access to projects
const taskViewRouter = Router({ mergeParams: true });
taskViewRouter.get("/:taskId", taskViewFindOne);
taskViewRouter.get("/", taskViewFindAll);
taskViewRouter.post("/", taskViewSaveOne);
taskViewRouter.patch("/:taskId", taskViewUpdateOne);
taskViewRouter.delete("/:taskId", taskViewDeleteOne);

// this router is used to handle requests from project view
const projectViewRouter = Router({ mergeParams: true });
projectViewRouter.get("/:taskId", projectViewFindOne);
projectViewRouter.get("/", projectViewFindAll);
projectViewRouter.post("/", projectViewSaveOne);
projectViewRouter.patch("/:taskId", projectViewUpdateOne);
projectViewRouter.delete("/:taskId", projectViewDeleteOne);

module.exports = { adminTaskRouter, taskViewRouter, projectViewRouter };
