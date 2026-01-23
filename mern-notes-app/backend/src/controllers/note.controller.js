import Note from "../models/note.model.js";

export const getNote = async (req, res) => {
	const { id } = req.params;

	try {
		const note = await Note.findById(id);
		if (!note) {
			return res.status(404).json({ message: "Note not found!" });
		}
		res.status(200).json(note);
	} catch (err) {
		console.error("Error in the getNote controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const getAllNotes = async (_, res) => {
	try {
		const notes = await Note.find();

		if (notes.length === 0) {
			return res
				.status(404)
				.json({ message: "It's empty, no notes found!" });
		}

		res.status(200).json(notes);
	} catch (err) {
		console.error("Error in the getAll controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const createNote = async (req, res) => {
	const { title, description, isCompleted } = req.body;

	if (!title || !description) {
		return res.status(400).json({ message: "Please provide all fields!" });
	}

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

	if (!title && !description) {
		return res
			.status(404)
			.json({ message: "Please provide at least one field to update!" });
	}
	try {
		const updatedNote = await Note.findByIdAndUpdate(
			id,
			{ title, description, isCompleted },
			{
				new: true,
				runValidators: true,
			},
		);

		if (!updatedNote) {
			return res.status(404).json({ message: "Note not found!" });
		}

		res.status(200).json(updatedNote);
	} catch (err) {
		console.error("Error in the updateNote controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const deleteNote = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedNote = await Note.findByIdAndDelete(id);

		if (!deletedNote) {
			return res.status(404).json({ message: "Note not found!" });
		}

		res.status(200).json({ message: "Note deleted successfully!" });
	} catch (err) {
		console.error("Error in the deleteNote controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};

export const deleteAllNotes = async (_, res) => {
	try {
		const notes = await Note.deleteMany();
		if (notes.deletedCount === 0) {
			return res
				.status(404)
				.json({ message: "It's empty, no notes deleted!" });
		}

		res.status(200).json({ message: "All notes deleted successfully!" });
	} catch (err) {
		console.error("Error in the deleteAllNotes controller!", err.message);
		res.status(500).json({ message: "Internal Server Error!" });
	}
};
