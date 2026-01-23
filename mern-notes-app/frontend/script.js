/**
 * Configuration: Base URL for the MERN Backend API
 * Ensure your Express server is running on this port.
 */
const BASE_URL = "http://localhost:5000/note";

// --- Theme Management Section ---
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const htmlElement = document.documentElement;

/**
 * Initialize Theme: Checks local storage for a saved preference.
 * Defaults to 'light' if no preference is found.
 */
const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

/**
 * Event Listener for Theme Toggle: Switches between dark and light modes
 * and persists the choice in the browser's localStorage.
 */
themeToggle.addEventListener("click", () => {
	const currentTheme = htmlElement.getAttribute("data-theme");
	const newTheme = currentTheme === "dark" ? "light" : "dark";

	htmlElement.setAttribute("data-theme", newTheme);
	localStorage.setItem("theme", newTheme);
	themeIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

// --- DOM Element Selectors ---
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const noteIdInput = document.getElementById("noteId"); // Hidden input for Edit mode
const notesDisplay = document.getElementById("notesDisplay");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const uiMessage = document.getElementById("uiMessage");

/**
 * Function: showUIFeedback
 * Displays a success or error message banner at the top of the form.
 * @param {string} message - The text returned from the backend or error handler.
 * @param {string} type - 'success' or 'error' (used for CSS styling).
 */
function showUIFeedback(message, type) {
	uiMessage.innerText = message;
	uiMessage.className = `ui-message ${type}`;
	uiMessage.style.display = "block";

	// Automatically hide the message after 3 seconds
	setTimeout(() => {
		uiMessage.style.display = "none";
	}, 3000);
}

/**
 * Function: fetchNotes
 * Feature: GET ALL NOTES
 * Fetches the list of all notes from the backend and triggers the render.
 */
async function fetchNotes() {
	try {
		const res = await fetch(`${BASE_URL}/get-all-notes`);
		const data = await res.json();

		// Check if backend returned 404 (Empty Database edge case)
		if (res.status === 404) {
			notesDisplay.innerHTML = `<p class='empty-msg'>${data.message}</p>`;
			return;
		}
		renderNotes(data);
	} catch (err) {
		notesDisplay.innerHTML = "<p class='empty-msg'>⚠️ Server offline.</p>";
	}
}

/**
 * Function: renderNotes
 * Feature: UI GENERATION
 * Loops through the array of notes and injects HTML cards into the DOM.
 */
function renderNotes(notes) {
	notesDisplay.innerHTML = notes
		.map(
			(note, index) => `
            <div class="note-card" style="animation-delay: ${index * 0.1}s">
                <div class="note-info">
                    <h3>${note.title}</h3>
                    <p>${note.description}</p>
                </div>
                <div class="note-actions">
                    <button class="edit-btn" onclick="prepareEdit('${note._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteNote('${note._id}')">Delete</button>
                </div>
            </div>
        `,
		)
		.join("");
}

/**
 * Event Listener: Note Form Submission
 * Feature: CREATE & UPDATE
 * Handles form submission for both new notes and existing note updates.
 */
noteForm.addEventListener("submit", async (e) => {
	e.preventDefault(); // Stop page reload

	const id = noteIdInput.value; // Checks if we are in 'Edit' mode
	const noteData = { title: titleInput.value, description: descInput.value };

	// Decide route and method based on whether an ID exists
	const url = id
		? `${BASE_URL}/update-note/${id}`
		: `${BASE_URL}/create-note`;
	const method = id ? "PUT" : "POST";

	try {
		const res = await fetch(url, {
			method: method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(noteData),
		});

		const result = await res.json();

		if (res.ok) {
			// Show feedback using the message or custom text
			showUIFeedback(
				id ? "✅ Update successful!" : "✅ Created successfully!",
				"success",
			);
			resetForm();
			fetchNotes(); // Refresh the list
		} else {
			// Show backend edge case: "Please provide all fields!"
			showUIFeedback(result.message, "error");
		}
	} catch (err) {
		showUIFeedback("❌ Connection error", "error");
	}
});

/**
 * Function: prepareEdit
 * Feature: GET SINGLE NOTE
 * Fetches data for one note and fills the form for editing.
 */
window.prepareEdit = async (id) => {
	try {
		const res = await fetch(`${BASE_URL}/get-note/${id}`);
		const note = await res.json();
		if (res.ok) {
			// Populate form fields
			titleInput.value = note.title;
			descInput.value = note.description;
			noteIdInput.value = note._id;

			// Update UI to reflect Edit Mode
			submitBtn.innerHTML = "Update Note";
			formTitle.innerHTML = "Edit Note";
			cancelEditBtn.classList.remove("hidden");
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	} catch (err) {
		showUIFeedback("❌ Error loading note", "error");
	}
};

/**
 * Function: deleteNote
 * Feature: DELETE SINGLE NOTE
 * Removes one note from the database via its ID.
 */
window.deleteNote = async (id) => {
	try {
		const res = await fetch(`${BASE_URL}/delete-note/${id}`, {
			method: "DELETE",
		});
		const result = await res.json();

		if (res.ok) {
			// Show backend response: "Note deleted successfully!"
			showUIFeedback("✅ " + result.message, "success");
			fetchNotes();
		} else {
			showUIFeedback("❌ " + result.message, "error");
		}
	} catch (err) {
		showUIFeedback("❌ Delete failed", "error");
	}
};

/**
 * Event Listener: Delete All Button
 * Feature: DELETE ALL NOTES
 * Clears the entire database collection.
 */
document.getElementById("deleteAllBtn").addEventListener("click", async () => {
	try {
		const res = await fetch(`${BASE_URL}/delete-all-notes`, {
			method: "DELETE",
		});
		const result = await res.json();

		if (res.ok) {
			// Show backend response: "All notes deleted successfully!"
			showUIFeedback("✅ " + result.message, "success");
			fetchNotes();
		} else {
			// Show backend edge case: "It's empty, no notes deleted!"
			showUIFeedback("⚠️ " + result.message, "error");
		}
	} catch (err) {
		showUIFeedback("❌ Action failed", "error");
	}
});

/**
 * Function: resetForm
 * Clears inputs and reverts UI from 'Edit' mode back to 'Create' mode.
 */
function resetForm() {
	noteForm.reset();
	noteIdInput.value = "";
	submitBtn.innerHTML = "Save Note";
	formTitle.innerHTML = "Create New Note";
	cancelEditBtn.classList.add("hidden");
}

// Event Listener for the Cancel button
cancelEditBtn.addEventListener("click", resetForm);

// Initial call to load notes when the page is first opened
fetchNotes();
