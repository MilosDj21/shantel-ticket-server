const { Router } = require("express");
const { findOne, findAll, saveOne, updateOne, deleteOne, findOneByUser, findAllByUser, saveOneByUser, updateOneByUser } = require("../controllers/project");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const taskRouter = require("./projectTask");
const taskGroupRouter = require("./projectTaskGroup");

const router = Router();

router.use(verifyToken);

// routes for all projects, only admin can access them directly
router.get("/:projectId", [isAdmin], findOne);
router.get("/", [isAdmin], findAll);
router.get("/search/:searchValue", [isAdmin], findAll);
router.post("/", [isAdmin], saveOne);
router.patch("/", [isAdmin], updateOne);
router.delete("/:projectId", [isAdmin], deleteOne);

//routes for tasks, they are accessed from project, so user don't need to be checked
router.use("/:projectId/tasks", taskRouter);

//routes for task groups, they are accessed from project, so user don't need to be checked
router.use("/:projectId/taskGroups", taskGroupRouter);

// routes for user projects
const userProjectRouter = Router({ mergeParams: true });

userProjectRouter.get("/:projectId", findOneByUser);
userProjectRouter.get("/", findAllByUser);
userProjectRouter.get("/search/:searchValue", findAllByUser);
userProjectRouter.post("/", saveOneByUser);
userProjectRouter.patch("/", updateOneByUser);

const projectRouter = (module.exports = router);
projectRouter.userProjectRouter = userProjectRouter;
