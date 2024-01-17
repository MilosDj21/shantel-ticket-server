const { Router } = require("express");
const {
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
} = require("../controllers/projectTask");

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

module.exports = { taskViewRouter, projectViewRouter };
