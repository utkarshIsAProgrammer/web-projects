import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

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

		isCompleted: {
			type: Boolean,
			default: false,
		},
	},

	{ timestamps: true },
);

taskSchema.plugin(MongooseDelete, {
	deletedAt: true,
	overrideMethods: "all",
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
