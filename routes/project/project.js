const { Router } = require("express");
const { adminFindOne, adminFindAll, adminSaveOne, adminUpdateOne, adminDeleteOne, findOneByUser, findAllByUser, saveOneByUser, updateOneByUser } = require("../../controllers/project/project");
const { verifyToken, isAdmin } = require("../../middlewares/auth");
const { projectViewRouter: taskRouter } = require("./projectTask");
const taskGroupRouter = require("./projectTaskGroup");

// routes for all projects, only admin can access them directly
const adminProjectRouter = Router();
adminProjectRouter.use(verifyToken);
adminProjectRouter.get("/:projectId", [isAdmin], adminFindOne);
adminProjectRouter.get("/", [isAdmin], adminFindAll);
adminProjectRouter.get("/search/:searchValue", [isAdmin], adminFindAll);
adminProjectRouter.post("/", [isAdmin], adminSaveOne);
adminProjectRouter.patch("/:projectId", [isAdmin], adminUpdateOne);
adminProjectRouter.delete("/:projectId", [isAdmin], adminDeleteOne);
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
userProjectRouter.patch("/:projectId", updateOneByUser);

module.exports = { adminProjectRouter, userProjectRouter };
