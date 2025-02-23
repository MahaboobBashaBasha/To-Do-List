document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const clearCompletedBtn = document.getElementById('clearCompleted');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Load tasks from localStorage
    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        renderTasks();
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCount();
    }

    // Create new task
    function addTask(text) {
        if (text.trim() === '') return;
        
        tasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });
        
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Toggle task completion
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;

            const checkbox = li.querySelector('.task-checkbox');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(li);
        });

        updateTaskCount();
    }

    // Update task count
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    // Event Listeners
    addBtn.addEventListener('click', () => addTask(taskInput.value));

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    // Login functionality
    document.getElementById('loginBtn').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordStatus = document.querySelector('.password-status');
        
        // Simple validation - you should replace this with your actual validation logic
        if (username && password) {
            if (password.length >= 6) { // Example validation
                passwordStatus.innerHTML = '<i class="fas fa-check-circle"></i>';
                passwordStatus.className = 'password-status valid';
                document.getElementById('loginForm').classList.add('hidden');
                document.getElementById('todoApp').classList.remove('hidden');
            } else {
                passwordStatus.innerHTML = '<i class="fas fa-times-circle"></i>';
                passwordStatus.className = 'password-status invalid';
                alert('Password must be at least 6 characters long');
            }
        } else {
            passwordStatus.innerHTML = '<i class="fas fa-times-circle"></i>';
            passwordStatus.className = 'password-status invalid';
            alert('Please enter both username and password');
        }
    });

    // Clear password status on input
    document.getElementById('password').addEventListener('input', function() {
        const passwordStatus = document.querySelector('.password-status');
        passwordStatus.innerHTML = '';
        passwordStatus.className = 'password-status';
    });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('todoApp').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });

    // Add password visibility toggle
    document.querySelector('.toggle-password').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
            this.classList.add('showing');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
            this.classList.remove('showing');
        }
    });

    // Initial load
    loadTasks();
});
