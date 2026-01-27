import Task from "../models/task.model.js";

export const getTask = async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.findById(id);
		if (!task) {
			return res.status(404).json({ message: "Task not found!" });
		}
		res.status(200).json(task);
	} catch (err) {
		console.log("Error in the getTask controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const getAllTasks = async (_, res) => {
	try {
		const tasks = await Task.find();
		if (tasks.length === 0) {
			return res
				.status(404)
				.json({ message: "No tasks were added yet!" });
		}
		res.status(200).json(tasks);
	} catch (err) {
		console.log("Error in the getAllTasks controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const createTask = async (req, res) => {
	const { title, description, dueDate, priority, deletedAt, isCompleted } =
		req.body;
	if (!title || !description) {
		return res.status(400).json({ message: "Please provide all fields!" });
	}

	try {
		const newTask = new Task({
			title,
			description,
			dueDate,
			priority,
			deletedAt,
			isCompleted,
		});
		await newTask.save();
		res.status(201).json(newTask);
	} catch (err) {
		console.log("Error in the createTask controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const updateTask = async (req, res) => {
	const { id } = req.params;
	const { title, description, dueDate, priority, deletedAt, isCompleted } =
		req.body;
	if (!title || !description) {
		return res.status(400).json({ message: "Please provide all fields!" });
	}

	try {
		const updatedTask = await Task.findByIdAndUpdate(
			id,
			{
				title,
				description,
				dueDate,
				priority,
				deletedAt,
				isCompleted,
			},
			{ new: true, runValidators: true },
		);
		if (!updatedTask) {
			return res.status(404).json({ message: "Task not found!" });
		}
		res.status(200).json(updatedTask);
	} catch (err) {
		console.log("Error in the updateTask controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const permanentlyDeleteTask = async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.findByIdAndDelete(id);
		if (!task) {
			return res
				.status(404)
				.json({ message: "Task don't exist or already deleted!" });
		}

		res.status(200).json({ message: "Permanently deleted the task!" });
	} catch (err) {
		console.log(
			"Error in the permanentlyDeleteTask controller!",
			err.message,
		);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const permanentlyDeleteAllTasks = async (_, res) => {
	try {
		const tasks = await Task.deleteMany();
		if (tasks.deletedCount === 0) {
			return res
				.status(404)
				.json({ message: "Tasks don't exist or already deleted!" });
		}

		res.status(200).json({
			message: "Permanently deleted all tasks!",
		});
	} catch (err) {
		console.log(
			"Error in the permanentlyDeleteAllTasks controller!",
			err.message,
		);
		res.status(500).json({ message: "Internal server error!" });
	}
};

// soft controllers
export const moveTaskToBin = async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.deleteById(id);
		if (task.matchedCount === 0) {
			return res.status(404).json({ message: "Task not found!" });
		}
		res.status(200).json({ message: "Task moved to bin!" });
	} catch (err) {
		console.log("Error in the moveTaskToBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const restoreTaskFromBin = async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.restore({ _id: id });
		if (task.matchedCount === 0) {
			return res.status(404).json({ message: "Task not found in bin!" });
		}
		res.status(200).json({ message: "Task restored successfully!" });
	} catch (err) {
		console.log("Error in the restoreTaskFromBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const moveAllTasksToBin = async (_, res) => {
	try {
		const tasks = await Task.delete({});
		if (tasks.matchedCount === 0) {
			return res
				.status(404)
				.json({ message: "No tasks were added yet!" });
		}
		res.status(200).json({ message: "All tasks are moved to bin!" });
	} catch (err) {
		console.log("Error in the moveAllTasksToBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const restoreAllTasksFromBin = async (_, res) => {
	try {
		const tasks = await Task.restore({});
		if (tasks.modifiedCount === 0) {
			return res.status(404).json({ message: "Bin is already empty!" });
		}
		res.status(200).json({ message: "All tasks restored successfully!" });
	} catch (err) {
		console.log(
			"Error in the restoreAllTasksFromBin controller!",
			err.message,
		);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const showBin = async (_, res) => {
	try {
		const bin = await Task.findDeleted();
		if (bin.length === 0) {
			return res.status(200).json({ message: "Bin is empty!" });
		}
		res.status(200).json(bin);
	} catch (err) {
		console.log("Error in the showBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const toggleTaskCompletion = async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.findById(id);
		if (!task) {
			return res.status(404).json({ message: "Task not found!" });
		}
		task.isCompleted = !task.isCompleted;
		await task.save();
		res.status(200).json({
			message: `Task ${task.isCompleted ? "completed" : "incomplete"}`,
			task,
		});
	} catch (err) {
		console.log("Error in toggleTaskCompletion controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};
