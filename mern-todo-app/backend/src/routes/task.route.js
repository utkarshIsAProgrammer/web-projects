import express from "express";
import {
	getTask,
	getAllTasks,
	createTask,
	updateTask,
	deleteTask,
	deleteAllTasks,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/get-task/:id", getTask);
router.get("/get-all-tasks", getAllTasks);

router.put("/update-task/:id", updateTask);
router.post("/create-task", createTask);

router.delete("/delete-task/:id", deleteTask);
router.delete("/delete-all-tasks", deleteAllTasks);

export default router;
