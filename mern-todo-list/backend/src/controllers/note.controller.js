import Note from "../models/note.model.js";

export const getNote = async (req, res) => {
	const { id } = req.params;

	try {
		const note = await Note.findById(id);
		res.status(200).json(note);
	} catch (err) {
		console.error("Error in the getNote controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const getAllNotes = async (_, res) => {
	try {
		const notes = await Note.find();
		res.status(200).json(notes);
	} catch (err) {
		console.error("Error in the getAll controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const createNote = async (req, res) => {
	const { title, description, isCompleted } = req.body;

	try {
		const newNote = await Note.create({ title, description, isCompleted });
		res.status(201).json(newNote);
	} catch (err) {
		console.error("Error in the createNote controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const updateNote = async (req, res) => {
	const { id } = req.params;
	const { title, description, isCompleted } = req.body;

	try {
		const updatedNote = await Note.findByIdAndUpdate(
			id,
			{ title, description, isCompleted },
			{
				new: true,
				runValidators: true,
			},
		);
		res.status(200).json(updatedNote);
	} catch (err) {
		console.error("Error in the updateNote controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const deleteNote = async (req, res) => {
	const { id } = req.params;

	try {
		await Note.findByIdAndDelete(id);
		res.status(200).json({ message: "Note deleted successfully!" });
	} catch (err) {
		console.error("Error in the deleteNote controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const deleteAllNotes = async (_, res) => {
	try {
		await Note.deleteMany();
		res.status(200).json({ message: "All tasks deleted successfully!" });
	} catch (err) {
		console.error("Error in the deleteAllNotes controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};
