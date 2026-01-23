import Task from "../models/task.model.js";

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
	const { title, description, dueDate, priority, isDeleted, isCompleted } =
		req.body;

	try {
		const newTask = new Task({
			title,
			description,
			dueDate,
			priority,
			isDeleted,
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
	const { title, description, dueDate, priority, isDeleted, isCompleted } =
		req.body;

	try {
		const updatedTask = await Task.findByIdAndUpdate(
			id,
			{
				title,
				description,
				dueDate,
				priority,
				isDeleted,
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
