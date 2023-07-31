(function (){
    let tasks = [];
    const tasksList = document.getElementById('list');
    const addTaskInput = document.getElementById('add');
    const tasksCounter = document.getElementById('tasks-counter');

    async function fetchTodos(){
        /*
        fetch('https://jsonplaceholder.typicode.com/todos')
        .then(function(response){return response.json()})
        .then(function(data){
            tasks = data.slice(0,10);
            renderList();
        })
        .catch(function(error){
            console.log('error', error);
        });
        */

        try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await response.json();
        tasks = data.slice(0,10);
        renderList();
        }
        catch (error){
            console.log(error);
        }
    }

    function addTaskToDOM(task){
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ""} class="custom-checkbox">
        <label for="${task.id}">${task.title}</label>
        <img src="trash.png" class="delete" data-id="${task.id}" />
        `;
        tasksList.append(li);
    }

    function renderList(){
        tasksList.innerHTML = "";
        for (task of tasks){
            addTaskToDOM(task);
        }
        tasksCounter.textContent = tasks.length;
    }

    function toggleTask(taskId) {
        flag = false;
        for (task of tasks){
            if (task.id == taskId){
                task.completed = !task.completed;
                flag = true;
            }
        }

        if (flag == true){
            renderList();
            showNotification('Task toggled successfully');
            return;
        }
        showNotification('Task could not be toggled');
    }

    function deleteTask (taskId) {
        const newTasks = tasks.filter(function(task){
            return task.id != taskId
        })
        tasks = newTasks;
        renderList();
        showNotification('Task deleted successfully');
    }

    function addTask (task) {
        if (task){
            tasks.push(task);
            renderList();
            showNotification("Task added successfully");
            return;
        }
        showNotification("Task is empty");
    }

    function showNotification(text) {
        alert(text);
    }

    function getTask(e){
        if (e.key == "Enter"){
            const taskText = e.target.value;

            if (taskText == ""){
                showNotification("The text is empty");
                return;
            }

            const task = {
                id: Date.now().toString(),
                title: taskText,
                done: false
            }
            
            addTask(task);
            e.target.value = "";
        }
    }

    function eventDelegation(e){
        const target = e.target;
        if (target.className == 'delete'){
            const taskId = target.dataset.id;
            deleteTask(taskId);
            return;
        }
        else if(target.className == 'custom-checkbox'){
            const taskId = target.id;
            toggleTask(taskId);
            return;
        }
    }

    function initializeApp(){
        document.getElementById('add').addEventListener('keyup', getTask);
        document.addEventListener('click', eventDelegation);
        fetchTodos();
    }

    initializeApp();
})();