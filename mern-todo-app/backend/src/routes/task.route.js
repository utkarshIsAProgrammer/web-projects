import express from "express";
import {
	getTask,
	getAllTasks,
	createTask,
	updateTask,
	permanentlyDeleteTask,
	permanentlyDeleteAllTasks,
	moveTaskToBin,
	restoreTaskFromBin,
	moveAllTasksToBin,
	restoreAllTasksFromBin,
	emptyBin,
	showBin,
} from "../controllers/task.controller.js";
import { validateId } from "../middlewares/validateId.middleware.js";

const router = express.Router();

router.get("/get-task/:id", validateId, getTask);
router.get("/get-all-tasks", getAllTasks);

router.put("/update-task/:id", validateId, updateTask);
router.post("/create-task", createTask);

router.delete("/delete-task/:id", validateId, permanentlyDeleteTask);
router.delete("/delete-all-tasks", permanentlyDeleteAllTasks);

router.patch("/move-task-to-bin/:id", validateId, moveTaskToBin);
router.patch("/restore-task-from-bin/:id", validateId, restoreTaskFromBin);
router.patch("/move-all-tasks-to-bin", moveAllTasksToBin);
router.patch("/restore-all-tasks-from-bin", restoreAllTasksFromBin);
router.get("/bin", showBin);
router.delete("/empty-bin", emptyBin);

export default router;
