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

  let tasks = [];
  let currentSelectedPriority = 'medium';


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

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
    closeModal();
  });


});