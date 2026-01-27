import express from "express";
import {
	getTask,
	getAllTasks,
	createTask,
	updateTask,
	deleteTask,
	deleteAllTasks,
	moveTaskToBin,
	restoreTaskFromBin,
	moveAllTasksToBin,
	restoreAllTasksFromBin,
	showBin,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/get-task/:id", getTask);
router.get("/get-all-tasks", getAllTasks);

router.put("/update-task/:id", updateTask);
router.post("/create-task", createTask);

router.delete("/delete-task/:id", deleteTask);
router.delete("/delete-all-tasks", deleteAllTasks);

router.patch("/move-task-to-bin/:id", moveTaskToBin);
router.patch("/restore-task-from-bin/:id", restoreTaskFromBin);
router.patch("/move-all-tasks-to-bin", moveAllTasksToBin);
router.patch("/restore-all-tasks-from-bin", restoreAllTasksFromBin);
router.get("/bin", showBin);

export default router;
