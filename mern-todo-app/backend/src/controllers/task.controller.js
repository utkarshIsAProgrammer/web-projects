import Task from "../models/task.model.js";
// import MongooseDelete from "mongoose-delete";

export const getTask = async (req, res) => {
	const { id } = req.params;

	try {
		const task = await Task.findById(id);
		res.status(200).json(task);
	} catch (err) {
		console.log("Error in the getTask controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const getAllTasks = async (_, res) => {
	try {
		const tasks = await Task.find();
		res.status(200).json(tasks);
	} catch (err) {
		console.log("Error in the getAllTasks controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const createTask = async (req, res) => {
	const { title, description, dueDate, priority, deletedAt, isCompleted } =
		req.body;

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
		res.status(200).json(updatedTask);
	} catch (err) {
		console.log("Error in the updateTask controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const deleteTask = async (req, res) => {
	const { id } = req.params;

	try {
		await Task.findByIdAndDelete(id);
		res.status(200).json({ message: "Task deleted successfully!" });
	} catch (err) {
		console.log("Error in the deleteTask controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const deleteAllTasks = async (_, res) => {
	try {
		await Task.deleteMany();
		res.status(200).json({ message: "All tasks deleted successfully!" });
	} catch (err) {
		console.log("Error in the deleteAllTasks controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

// soft controllers
export const moveTaskToBin = async (req, res) => {
	const { id } = req.params;

	try {
		await Task.deleteById(id);
		res.status(200).json({ message: "Task moved to bin!" });
	} catch (err) {
		console.log("Error in the moveTaskToBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const restoreTaskFromBin = async (req, res) => {
	const { id } = req.params;

	try {
		await Task.restore({ _id: id });
		res.status(200).json({ message: "Task restored successfully!" });
	} catch (err) {
		console.log("Error in the restoreTaskFromBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const moveAllTasksToBin = async (_, res) => {
	try {
		await Task.delete({});
		res.status(200).json({ message: "All tasks are moved to bin!" });
	} catch (err) {
		console.log("Error in the moveAllTasksToBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const restoreAllTasksFromBin = async (_, res) => {
	try {
		await Task.restore({});
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
		res.status(200).json(bin);
	} catch (err) {
		console.log("Error in the showBin controller!", err.message);
		res.status(500).json({ message: "Internal server error!" });
	}
};
