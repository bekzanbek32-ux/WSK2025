//Place your code here
// Массив для хранения всех задач (или комментариев)
let tasks = [];
let currentFilter = 'All';

// 1. Функция добавления (срабатывает при клике на "Add Task")
function addTask() {
  const titleInput = document.getElementById('taskTitle');
  const descInput = document.getElementById('taskDescription');
  const categorySelect = document.getElementById('taskCategory');

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const category = categorySelect.value;

  // Проверка, чтобы не добавлять пустые поля
  if (title === '' || description === '') {
    alert('Заполните оба поля!');
    return;
  }

  // Создаем объект новой записи
  const newTask = {
    id: Date.now(), // уникальный ID на основе текущего времени
    title: title,
    description: description,
    category: category,
    completed: false
  };

  // Добавляем в общий массив
  tasks.push(newTask);

  // Очищаем поля ввода
  titleInput.value = '';
  descInput.value = '';

  // Перерисовываем список на экране
  renderTasks();
}

// 2. Функция отрисовки списка в <ul id="taskList">
function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Очищаем старый список перед обновлением

  // Фильтруем массив в зависимости от выбранной кнопки
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'All') return true;
    return task.category === currentFilter;
  });

  // Создаем HTML для каждого элемента с твоими CSS-классами
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    // Если задача выполнена, добавляем класс 'completed' из твоего CSS
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Нижний регистр категории нужен для классов .work, .personal, .urgent
    const categoryClass = task.category.toLowerCase();

    li.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div class="task-info">
          <div style="display: flex; align-items: center;">
            <input 
              type="checkbox" 
              ${task.completed ? 'checked' : ''} 
              onchange="toggleComplete(${task.id})"
            />
            <span class="task-title">${escapeHTML(task.title)}</span>
            <span class="task-category ${categoryClass}">${task.category}</span>
          </div>
          <span class="task-description">${escapeHTML(task.description)}</span>
        </div>
      </div>

      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// 3. Функция фильтрации (срабатывает при клике на кнопки фильтров)
function filterTasks(category) {
  currentFilter = category;
  renderTasks();
}

// 4. Отметка выполнения (чекбокс)
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

// 5. Удаление записи
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// 6. Редактирование записи
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = prompt('Изменить имя / заголовок:', task.title);
  if (newTitle === null) return; // Нажали "Отмена"

  const newDesc = prompt('Изменить комментарий / описание:', task.description);
  if (newDesc === null) return;

  if (newTitle.trim() !== '' && newDesc.trim() !== '') {
    task.title = newTitle.trim();
    task.description = newDesc.trim();
    renderTasks();
  }
}

// Защита от случайного ввода HTML-тегов пользователем
function escapeHTML(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}