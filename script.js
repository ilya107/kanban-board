document.addEventListener("DOMContentLoaded", () => {
  const btnAdd = document.getElementById("btn-add");
  const taskSearch = document.getElementById("task-search");

  const btnFilterAll = document.getElementById("filter-all");
  const btnFilterHigh = document.getElementById("filter-high");
  const btnFilterMedium = document.getElementById("filter-medium");
  const btnFilterLow = document.getElementById("filter-low");

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
  
  let tasks = [];
  let currentSelectedPriority = 'medium';
  

  btnAdd.addEventListener("click", () => {
    modalWrapper.classList.add("open");
  });

  btnCancel.addEventListener("click", closeModal);

  priorityButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      priorityButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentSelectedPriority = btn.dataset.priority;
    });
  });

  taskForm.addEventListener("submit", event => {
    event.preventDefault();
    addTask();
    closeModal();
    renderBoard();
  });

  function closeModal() {
    modalWrapper.classList.remove("open");
    titleInput.value = "";
    descriptionInput.value = "";

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

  function renderBoard() {
    todoZone.innerHTML = "";
    inprogressZone.innerHTML = "";
    doneZone.innerHTML = "";

    let countTodo = 0;
    let countInProgress = 0;
    let countDone = 0;

    tasks.forEach(task => {
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
  }
});