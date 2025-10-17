
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null;

// Form submit event
document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  const taskInput = document.getElementById('taskInput');
  const taskDesc = document.getElementById('task-description');
  const taskDeadline = document.getElementById('Task-Deadline');

  const taskText = taskInput.value.trim();
  const description = taskDesc.value.trim();
  const deadline = taskDeadline.value;

  if (taskText !== '') {
    const newTask = {
      text: taskText,
      description: description || "No description provided",
      deadline: deadline || "No deadline",
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    taskDesc.value = '';
    taskDeadline.value = '';
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial render
renderTasks();

function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskCard');
    taskCard.classList.add(task.completed ? "completed" : "pending");

    const taskTitle = document.createElement('h1');
    taskTitle.innerText = task.text;

    const taskDesc = document.createElement('p');
    taskDesc.classList.add("description");
    taskDesc.innerText = "📝 " + task.description;

    const taskDeadline = document.createElement('p');
    taskDeadline.innerText = "📅 Deadline: " + task.deadline;

    const taskStatus = document.createElement('p');
    taskStatus.classList.add('status');
    taskStatus.innerText = task.completed ? "✅ Completed" : "❌ InComplete";

    // ✅ Toggle complete/incomplete
    const toggleButton = document.createElement('button');
    toggleButton.classList.add("button-box");
    const toggleSpan = document.createElement("span");
    toggleSpan.classList.add("black");
    toggleSpan.innerText = task.completed ? "Mark as InComplete" : "Mark as Completed";
    toggleButton.appendChild(toggleSpan);
    toggleButton.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // ✅ Edit button
    const editButton = document.createElement('button');
    editButton.classList.add("button-box");
    const editSpan = document.createElement("span");
    editSpan.classList.add("blue");
    editSpan.innerText = "Edit";
    editButton.appendChild(editSpan);
    editButton.addEventListener('click', () => {
      const newTitle = prompt("Edit Task Title:", tasks[index].text);
      const newDesc = prompt("Edit Description:", tasks[index].description);
      const newDeadline = prompt("Edit Deadline (YYYY-MM-DD):", tasks[index].deadline);

      if (newTitle && newTitle.trim() !== "") tasks[index].text = newTitle.trim();
      if (newDesc && newDesc.trim() !== "") tasks[index].description = newDesc.trim();
      if (newDeadline && newDeadline.trim() !== "") tasks[index].deadline = newDeadline.trim();

      saveTasks();
      renderTasks();
    });

    // ✅ Delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("button-box");
    const deleteSpan = document.createElement("span");
    deleteSpan.classList.add("red");
    deleteSpan.innerText = "Delete";
    deleteButton.appendChild(deleteSpan);
    deleteButton.addEventListener('click', () => {
      indexToBeDeleted = index;
      confirmEl.style.display = "block";
      taskManagerContainer.classList.add("overlay");
    });

    // ✅ Append elements
    taskCard.appendChild(taskTitle);
    taskCard.appendChild(taskDesc);
    taskCard.appendChild(taskDeadline);
    taskCard.appendChild(taskStatus);
    taskCard.appendChild(toggleButton);
    taskCard.appendChild(editButton);
    taskCard.appendChild(deleteButton);

    taskContainer.appendChild(taskCard);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

confirmedBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
  deleteTask(indexToBeDeleted);
});

cancelledBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
});