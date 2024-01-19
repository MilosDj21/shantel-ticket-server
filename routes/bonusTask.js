const { Router } = require("express");
const {
  findOne,
  findAll,
  saveOne,
  updateOne,
  deleteOne,
  findOneByCreationUser,
  findAllByCreationUser,
  saveOneByCreationUser,
  updateOneByCreationUser,
  findOneByCompletionUser,
  findAllByCompletionUser,
  saveOneByCompletionUser,
  updateOneByCompletionUser,
} = require("../controllers/bonusTask");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const bonusTaskMessageRouter = require("./bonusTaskMessage");

const router = Router();

router.use(verifyToken);

// routes for all bonus tasks, only admin can access them directly
router.get("/:bonusTaskId", [isAdmin], findOne);
router.get("/", [isAdmin], findAll);
router.get("/search/:searchValue", [isAdmin], findAll);
router.post("/", [isAdmin], saveOne);
router.patch("/:bonusTaskId", [isAdmin], updateOne);
router.delete("/:bonusTaskId", [isAdmin], deleteOne);

//routes for bonus taks messages, they are accessed from bonus task, so user don't need to be checked
router.use("/:bonusTaskId/bonusTaskMessage", bonusTaskMessageRouter);

// routes for user bonus tasks
const userBonusTaskRouter = Router({ mergeParams: true });

//this is for bonus tasks that are CREATED by userId which is in user route
userBonusTaskRouter.get("/:bonusTaskId", findOneByCreationUser);
userBonusTaskRouter.get("/", findAllByCreationUser);
userBonusTaskRouter.get("/search/:searchValue", findAllByCreationUser);
userBonusTaskRouter.post("/", saveOneByCreationUser);
userBonusTaskRouter.patch("/:bonusTaskId", updateOneByCreationUser);

//this is for bonus tasks that are COMPLETED by userId which is in user route
userBonusTaskRouter.get("/:bonusTaskId", findOneByCompletionUser);
userBonusTaskRouter.get("/", findAllByCompletionUser);
userBonusTaskRouter.get("/search/:searchValue", findAllByCompletionUser);
userBonusTaskRouter.post("/", saveOneByCompletionUser);
userBonusTaskRouter.patch("/:bonusTaskId", updateOneByCompletionUser);

const bonusTaskRouter = (module.exports = router);
bonusTaskRouter.userBonusTaskRouter = userBonusTaskRouter;
