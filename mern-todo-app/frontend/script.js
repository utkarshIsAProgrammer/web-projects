const API_URL = "http://localhost:5000/todo";
let currentTab = "all";

// Initialize App
function initApp() {
	// Load theme
	const savedTheme = localStorage.getItem("theme");
	const prefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)",
	).matches;

	if (!savedTheme) {
		if (prefersDark) {
			document.body.classList.add("dark");
			document.getElementById("themeIcon").className = "fas fa-sun";
			localStorage.setItem("theme", "dark");
		} else {
			localStorage.setItem("theme", "light");
		}
	} else if (savedTheme === "dark") {
		document.body.classList.add("dark");
		document.getElementById("themeIcon").className = "fas fa-sun";
	}

	// Load tasks
	switchTab("all");

	// Scroll handler for FAB
	window.addEventListener("scroll", () => {
		const fab = document.querySelector(".fab");
		if (window.scrollY > 300) {
			fab.style.display = "flex";
		} else {
			fab.style.display = "none";
		}
	});

	// Enter key handlers
	document.getElementById("taskTitle").addEventListener("keypress", (e) => {
		if (e.key === "Enter") createTask();
	});
	document.getElementById("taskDesc").addEventListener("keypress", (e) => {
		if (e.key === "Enter") createTask();
	});
}

// Theme Toggle
function toggleTheme() {
	const isDark = document.body.classList.toggle("dark");
	localStorage.setItem("theme", isDark ? "dark" : "light");
	document.getElementById("themeIcon").className = isDark
		? "fas fa-sun"
		: "fas fa-moon";
}

// Scroll to Top
function scrollToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}

// Toast Notification
function showToast(message, type = "success") {
	const container = document.getElementById("toastContainer");
	const toast = document.createElement("div");
	toast.className = `toast ${type}`;
	toast.innerHTML = `
          <div class="toast-icon">
              <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}"></i>
          </div>
          <div class="toast-message">${message}</div>
      `;
	container.appendChild(toast);

	setTimeout(() => {
		toast.style.opacity = "0";
		toast.style.transform = "translateX(100px)";
		setTimeout(() => toast.remove(), 300);
	}, 3500);
}

// Fetch Tasks
async function fetchTasks() {
	const container = document.getElementById("tasksContainer");
	container.innerHTML = `
          <div class="loading-state">
              <div class="loader"></div>
              <p class="loading-text">Loading tasks...</p>
          </div>
      `;

	try {
		const route = currentTab === "all" ? "/get-all-tasks" : "/bin";
		const response = await fetch(`${API_URL}${route}`);
		const data = await response.json();

		if (
			!response.ok ||
			data.message === "Bin is empty!" ||
			data.message === "No tasks were added yet!"
		) {
			container.innerHTML = `
                  <div class="empty-state">
                      <div class="empty-icon">
                          <i class="fas fa-clipboard-list"></i>
                      </div>
                      <h3 class="empty-title">No tasks found</h3>
                      <p class="empty-description">${data.message || "Start by creating your first task!"}</p>
                  </div>
              `;
			return;
		}
		renderTasks(data);
	} catch (err) {
		showToast("Failed to connect to server", "error");
		container.innerHTML = `
              <div class="empty-state">
                  <div class="empty-icon" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);">
                      <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
                  </div>
                  <h3 class="empty-title">Connection Error</h3>
                  <p class="empty-description">Unable to connect to the server</p>
              </div>
          `;
	}
}

// Render Tasks
function renderTasks(tasks) {
	const container = document.getElementById("tasksContainer");
	container.innerHTML = "";

	tasks.forEach((task, index) => {
		const isBin = currentTab === "bin";
		const taskCard = document.createElement("div");
		taskCard.className = `task-card ${task.priority} ${task.isCompleted ? "completed" : ""}`;
		taskCard.style.animationDelay = `${index * 0.05}s`;

		// Format due date
		let dueDateHTML = "";
		if (task.dueDate) {
			const dueDate = new Date(task.dueDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			dueDate.setHours(0, 0, 0, 0);

			const diffTime = dueDate - today;
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			let dateClass = "";
			let dateText = "";

			if (diffDays < 0) {
				dateClass = "date-overdue";
				dateText = `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`;
			} else if (diffDays === 0) {
				dateClass = "date-today";
				dateText = "Due today";
			} else if (diffDays === 1) {
				dateText = "Due tomorrow";
			} else if (diffDays <= 7) {
				dateText = `Due in ${diffDays} days`;
			} else {
				dateText = `Due on ${dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
			}

			dueDateHTML = `<div class="task-date ${dateClass}"><i class="fas fa-calendar-alt"></i> ${dateText}</div>`;
		}

		taskCard.innerHTML = `
              <div class="task-content">
                  <div class="task-info ${task.isCompleted ? "done" : ""}">
                      <div class="task-header">
                          <h3 class="task-title">${escapeHtml(task.title)}</h3>
                          <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
                          ${task.isCompleted ? '<span class="completed-badge"><i class="fas fa-check-circle"></i> Completed</span>' : ""}
                      </div>
                      <p class="task-description">${escapeHtml(task.description)}</p>
                      ${dueDateHTML}
                  </div>
                  <div class="task-actions">
                      ${
							!isBin
								? `
                          <button class="btn-icon ${task.isCompleted ? "btn-warning" : "btn-success"}" 
                              onclick="handleAction('/update-task/${task._id}', 'PUT', {isCompleted: ${!task.isCompleted}})"
                              title="${task.isCompleted ? "Mark as incomplete" : "Mark as complete"}">
                              <i class="fas ${task.isCompleted ? "fa-undo" : "fa-check"}"></i>
                          </button>
                          <button class="btn-icon btn-info" 
                              onclick="openEditModal('${task._id}', '${escapeHtml(task.title)}', '${escapeHtml(task.description)}', '${task.priority}')"
                              title="Edit task">
                              <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn-icon btn-danger" 
                              onclick="handleAction('/move-task-to-bin/${task._id}', 'PATCH')"
                              title="Move to bin">
                              <i class="fas fa-trash"></i>
                          </button>
                      `
								: `
                          <button class="btn-icon btn-info" 
                              onclick="handleAction('/restore-task-from-bin/${task._id}', 'PATCH')"
                              title="Restore task">
                              <i class="fas fa-trash-restore"></i>
                          </button>
                          <button class="btn-icon btn-danger" 
                              onclick="handleAction('/delete-task/${task._id}', 'DELETE')"
                              title="Delete permanently">
                              <i class="fas fa-times-circle"></i>
                          </button>
                      `
						}
                  </div>
              </div>
          `;
		container.appendChild(taskCard);
	});
}

// Handle Actions
async function handleAction(endpoint, method, body = null) {
	try {
		const options = {
			method,
			headers: { "Content-Type": "application/json" },
		};
		if (body) options.body = JSON.stringify(body);

		const response = await fetch(`${API_URL}${endpoint}`, options);
		const data = await response.json();

		if (response.ok) {
			fetchTasks();
			if (data.message) showToast(data.message);
		} else {
			showToast(data.message, "error");
		}
	} catch (err) {
		showToast("Request failed", "error");
	}
}

// Create Task
async function createTask() {
	const title = document.getElementById("taskTitle").value.trim();
	const description = document.getElementById("taskDesc").value.trim();

	if (!title || !description) {
		showToast("Please fill title and description", "error");
		return;
	}

	await handleAction("/create-task", "POST", {
		title,
		description,
		priority: document.getElementById("taskPriority").value,
		dueDate: document.getElementById("taskDate").value || new Date(),
	});

	document.getElementById("taskTitle").value = "";
	document.getElementById("taskDesc").value = "";
	document.getElementById("taskDate").value = "";
}

// Modal Functions
function openEditModal(id, title, desc, priority) {
	document.getElementById("editId").value = id;
	document.getElementById("editTitle").value = title;
	document.getElementById("editDesc").value = desc;
	document.getElementById("editPriority").value = priority;
	document.getElementById("editModal").classList.add("show");
}

function closeModal() {
	document.getElementById("editModal").classList.remove("show");
}

function closeModalOnBackdrop(event) {
	if (event.target.id === "editModal") {
		closeModal();
	}
}

async function updateTask() {
	const id = document.getElementById("editId").value;
	await handleAction(`/update-task/${id}`, "PUT", {
		title: document.getElementById("editTitle").value,
		description: document.getElementById("editDesc").value,
		priority: document.getElementById("editPriority").value,
	});
	closeModal();
}

// Tab Management
function switchTab(tab) {
	currentTab = tab;

	const tabAll = document.getElementById("tabAll");
	const tabBin = document.getElementById("tabBin");

	if (tab === "all") {
		tabAll.classList.add("active");
		tabBin.classList.remove("active");
	} else {
		tabAll.classList.remove("active");
		tabBin.classList.add("active");
	}

	const actions = document.getElementById("tabActions");
	actions.innerHTML =
		tab === "all"
			? `
          <button class="btn-action-group btn-orange" onclick="handleAction('/move-all-tasks-to-bin', 'PATCH')">
              <i class="fas fa-inbox"></i> Move All to Bin
          </button>
      `
			: `
          <button class="btn-action-group btn-blue" onclick="handleAction('/restore-all-tasks-from-bin', 'PATCH')">
              <i class="fas fa-trash-restore-alt"></i> Restore All
          </button>
          <button class="btn-action-group btn-red" onclick="confirmEmptyBin()">
              <i class="fas fa-fire"></i> Empty Bin
          </button>
      `;

	fetchTasks();
}

function confirmEmptyBin() {
	if (
		confirm(
			"⚠️ Are you sure you want to permanently clear the bin? This cannot be undone.",
		)
	) {
		handleAction("/empty-bin", "DELETE");
	}
}

// Utility Functions
function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}

// Initialize on load
window.addEventListener("DOMContentLoaded", initApp);
