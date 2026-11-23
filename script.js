const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const categorySelect = document.getElementById('category-select');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');
const progress = document.getElementById('progress');
const clearBtn = document.getElementById('clear-btn');
const tabs = document.querySelectorAll('.tab');

let todos = JSON.parse(localStorage.getItem('todos_v2')) || [
  { id: 1, text: 'Market Research', category: 'Work', done: false },
  { id: 2, text: 'Competitive Analysis', category: 'Study', done: true },
];

let filter = 'all';

function save() {
  localStorage.setItem('todos_v2', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';

  const visible = todos.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  if (visible.length === 0) {
    list.innerHTML = '<li class="empty">Задач пока нет</li>';
  } else {
    visible.forEach((todo) => {
      const li = document.createElement('li');
      li.className = todo.done ? 'task done' : 'task';

      const label = document.createElement('label');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.done;
      checkbox.onchange = () => {
        todo.done = checkbox.checked;
        save();
        render();
      };

      const info = document.createElement('div');
      const cat = document.createElement('span');
      cat.className = 'task-cat';
      cat.textContent = todo.category;

      const title = document.createElement('span');
      title.className = 'task-text';
      title.textContent = todo.text;

      info.append(cat, title);
      label.append(checkbox, info);

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = todo.done ? 'Done' : 'To do';

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'del-btn';
      delBtn.textContent = '×';
      delBtn.onclick = () => {
        todos = todos.filter((t) => t.id !== todo.id);
        save();
        render();
      };

      li.append(label, badge, delBtn);
      list.append(li);
    });
  }

  const doneCount = todos.filter((t) => t.done).length;
  const activeCount = todos.length - doneCount;
  const percent = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  counter.textContent = `Осталось задач: ${activeCount}`;
  progress.textContent = `${percent}%`;
}

form.onsubmit = (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({
    id: Date.now(),
    text,
    category: categorySelect.value,
    done: false,
  });

  input.value = '';
  save();
  render();
};

tabs.forEach((tab) => {
  tab.onclick = () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    filter = tab.dataset.filter;
    render();
  };
});

clearBtn.onclick = () => {
  todos = todos.filter((t) => !t.done);
  save();
  render();
};

render();