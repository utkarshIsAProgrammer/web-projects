import express from "express";
import {
	getNote,
	getAllNotes,
	createNote,
	updateNote,
	deleteNote,
	deleteAllNotes,
} from "../controllers/note.controller.js";

const router = express.Router();

router.get("/get-note/:id", getNote);
router.get("/get-all-notes", getAllNotes);

router.post("/create-note", createNote);
router.put("/update-note/:id", updateNote);

router.delete("/delete-note/:id", deleteNote);
router.delete("/delete-all-notes", deleteAllNotes);

export default router;
