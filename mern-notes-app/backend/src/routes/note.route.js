import express from "express";
import {
	getNote,
	getAllNotes,
	createNote,
	updateNote,
	deleteNote,
	deleteAllNotes,
} from "../controllers/note.controller.js";
import { validateID } from "../middlewares/validateId.middleware.js";

const router = express.Router();

router.get("/get-note/:id", validateID, getNote);
router.get("/get-all-notes", getAllNotes);

router.post("/create-note", createNote);
router.put("/update-note/:id", validateID, updateNote);

router.delete("/delete-note/:id", validateID, deleteNote);
router.delete("/delete-all-notes", deleteAllNotes);

export default router;
