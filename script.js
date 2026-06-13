document.addEventListener("DOMContentLoaded", () => {
  const btnAdd = document.getElementById("btn-add");
  const taskSearch = document.getElementById("task-search");

  const btnFilterAll = document.getElementById("filter-all");
  const btnFilterHigh = document.getElementById("filter-high");
  const btnFilterMedium = document.getElementById("filter-medium");
  const btnFilterLow = document.getElementById("filter-low");
  const filterButtons = [btnFilterAll, btnFilterHigh, btnFilterMedium, btnFilterLow];

  const btnSetPrHigh = document.querySelector("[data-priority='high']");
  const btnSetPrMedium = document.querySelector("[data-priority='medium']");
  const btnSetPrLow = document.querySelector("[data-priority='low']");
  const priorityButtons = [btnSetPrHigh, btnSetPrMedium, btnSetPrLow];

  const titleInput = document.getElementById("title-input");
  const descriptionInput = document.getElementById('description-input');

  const btnSave = document.getElementById("btn-save");
  const btnCancel = document.getElementById("btn-cancel");

  const modalWrapper = document.getElementById("modal-wrapper");
  const taskForm = document.getElementById("task-form");

  const todoZone = document.getElementById("todo-zone");
  const inprogressZone = document.getElementById("inprogress-zone");
  const doneZone = document.getElementById("done-zone");

  const todoAmount = document.getElementById("to-do-amount");
  const inprogressAmount = document.getElementById("in-progress-amount");
  const doneAmount = document.getElementById("done-amount");
  
  const tasksContainer = document.querySelector(".tasks-container");

  const savedTasks = localStorage.getItem("kanban-tasks");
  let tasks = savedTasks ? JSON.parse(savedTasks) : [];

  let currentSelectedPriority = 'medium';
  let searchQuery = "";
  let editingTaskId = null;
  let currentFilterPriority = 'all';

  renderBoard();

  btnAdd.addEventListener("click", () => {
    modalWrapper.classList.add("open");
  });

  btnCancel.addEventListener("click", closeModalAndReset);

  priorityButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      priorityButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSelectedPriority = btn.dataset.priority;
    });
  });

  tasksContainer.addEventListener("click", event => {
    const eventTarget = event.target;
    const isDeleteBtn = eventTarget.classList.contains("btn-delete");
    const isEditBtn = eventTarget.classList.contains("btn-edit");

    if (!isDeleteBtn && !isEditBtn) return;

    const cardId = eventTarget.dataset.id;

    if (isDeleteBtn) {
      tasks = tasks.filter(task => task.id !== cardId);
      renderBoard();
    } else {
      editingTaskId = cardId;

      const taskToEdit = tasks.find(task => task.id === cardId);
      if (!taskToEdit) return;

      titleInput.value = taskToEdit.title;
      descriptionInput.value = taskToEdit.description;

      currentSelectedPriority = taskToEdit.priority;
      priorityButtons.forEach(b => b.classList.remove("active"));

      const activePriorityBtn = document.querySelector(`.btn-priority[data-priority="${taskToEdit.priority}"]`);
      if (activePriorityBtn) activePriorityBtn.classList.add("active");

      btnSave.textContent = "Save Changes";
      modalWrapper.classList.add("open");
    }
  });

  taskForm.addEventListener("submit", event => {
    event.preventDefault();

    if (editingTaskId) {
      tasks = tasks.map(task => {
        if (task.id === editingTaskId) {
          return {
            ...task,
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            priority: currentSelectedPriority
          };
        }
        return task;
      });
    } else {
      addTask();
    }

    closeModalAndReset();
    renderBoard();
  });

  taskSearch.addEventListener("input", event => {
    searchQuery = event.target.value.toLowerCase().trim();
    renderBoard();
  })

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilterPriority = btn.id.replace("filter-", "");
      renderBoard();
    });
  });

  tasksContainer.addEventListener("dragstart", event => {
    const card = event.target.closest(".task-card");
    if (!card) return;

    event.dataTransfer.setData("text/plain", card.dataset.id);
    setTimeout(() => card.style.opacity = "0.5", 0);
  });

  tasksContainer.addEventListener("dragend", event => {
    const card = event.target.closest(".task-card");
    if (card) card.style.opacity = "1";
  });

  tasksContainer.addEventListener("dragover", event => {
    const dropZone = event.target.closest(".drop-zone");
    if (!dropZone) return;

    event.preventDefault();
    dropZone.classList.add("drag-over");
  });

  tasksContainer.addEventListener("dragleave", event => {
    const dropZone = event.target.closest(".drop-zone");
    if (dropZone) dropZone.classList.remove("drag-over");
  })

  tasksContainer.addEventListener("drop", event => {
    const dropZone = event.target.closest(".drop-zone");
    if (!dropZone) return;

    event.preventDefault();
    dropZone.classList.remove("drag-over");

    const draggedTaskId = event.dataTransfer.getData("text/plain");
    const targetColumnName = dropZone.dataset.column;

    tasks = tasks.map(task => {
      if (task.id === draggedTaskId) {
        return { ...task, column: targetColumnName };
      }
      return task;
    });
    renderBoard();
  })

  function closeModalAndReset() {
    modalWrapper.classList.remove("open");
    taskForm.reset();

    editingTaskId = null;
    btnSave.textContent = "Save";

    currentSelectedPriority = 'medium';
    priorityButtons.forEach(b => b.classList.remove("active"));
    btnSetPrMedium.classList.add("active");
  }

  function addTask() {
    const newTask = {
      id: Date.now().toString(),
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      column: 'todo',
      priority: currentSelectedPriority
    };
    tasks.push(newTask);
  }

  function saveToLocalStorage() {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }

  function renderBoard() {
    todoZone.innerHTML = "";
    inprogressZone.innerHTML = "";
    doneZone.innerHTML = "";

    let countTodo = 0;
    let countInProgress = 0;
    let countDone = 0;

    tasks.forEach(task => {

      const taskTitle = task.title.toLowerCase();
      const taskDesc = task.description.toLowerCase();

      if (searchQuery && !taskTitle.includes(searchQuery) && !taskDesc.includes(searchQuery)) {
        return;
      }

      if (currentFilterPriority !== "all" && task.priority !== currentFilterPriority) {
        return;
      }

      const cardHTML = `
      <div class="task-card" draggable="true" data-id="${task.id}">
        <span class="badge badge-${task.priority}">${task.priority}</span>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <div class="card-actions">
          <button class="btn-edit" data-id="${task.id}">Edit</button>
          <button class="btn-delete" data-id="${task.id}">Delete</button>
        </div>
      </div>
    `;
      if (task.column === "todo") {
        todoZone.insertAdjacentHTML("beforeend", cardHTML);
        countTodo++;
      } else if (task.column === "inprogress") {
        inprogressZone.insertAdjacentHTML("beforeend", cardHTML);
        countInProgress++;
      } else {
        doneZone.insertAdjacentHTML("beforeend", cardHTML);
        countDone++;
      }
    });
    todoAmount.textContent = countTodo;
    inprogressAmount.textContent = countInProgress;
    doneAmount.textContent = countDone;
    saveToLocalStorage();
  }
});