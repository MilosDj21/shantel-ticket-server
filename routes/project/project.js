const { Router } = require("express");
const { findOne, findAll, saveOne, updateOne, deleteOne, findOneByUser, findAllByUser, saveOneByUser, updateOneByUser } = require("../../controllers/project/project");
const { verifyToken, isAdmin } = require("../../middlewares/auth");
const { projectViewRouter: taskRouter } = require("./projectTask");
const taskGroupRouter = require("./projectTaskGroup");

// routes for all projects, only admin can access them directly
const adminProjectRouter = Router();
adminProjectRouter.use(verifyToken);
adminProjectRouter.get("/:projectId", [isAdmin], findOne);
adminProjectRouter.get("/", [isAdmin], findAll);
adminProjectRouter.get("/search/:searchValue", [isAdmin], findAll);
adminProjectRouter.post("/", [isAdmin], saveOne);
adminProjectRouter.patch("/", [isAdmin], updateOne);
adminProjectRouter.delete("/:projectId", [isAdmin], deleteOne);
//routes for tasks, they are accessed from project, so user don't need to be checked
adminProjectRouter.use("/:projectId/tasks", taskRouter);
//routes for task groups, they are accessed from project, so user don't need to be checked
adminProjectRouter.use("/:projectId/taskGroups", taskGroupRouter);

// routes for user projects
const userProjectRouter = Router({ mergeParams: true });
userProjectRouter.get("/:projectId", findOneByUser);
userProjectRouter.get("/", findAllByUser);
userProjectRouter.get("/search/:searchValue", findAllByUser);
userProjectRouter.post("/", saveOneByUser);
userProjectRouter.patch("/", updateOneByUser);

module.exports = { adminProjectRouter, userProjectRouter };
