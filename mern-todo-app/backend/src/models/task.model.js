import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},

		description: {
			type: String,
			required: true,
		},

		dueDate: {
			type: Date,
			default: Date.now,
		},

		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},

		isDeleted: {
			type: Boolean,
			default: false,
		},

		isCompleted: {
			type: Boolean,
			default: false,
		},
	},

	{ timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
