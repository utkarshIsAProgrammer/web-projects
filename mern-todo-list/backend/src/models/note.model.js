import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
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

		isCompleted: {
			type: Boolean,
			default: false,
		},
	},

	{ timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
