const input = document.getElementById("taskInput")
const addBtn = document.getElementById("addTaskBtn")

const state = {
    tasks: []
}

/* ---------------- RENDER ---------------- */

function render() {

    const todoColumn = document.getElementById("todo")
    const progressColumn = document.getElementById("progress")
    const doneColumn = document.getElementById("done")

    todoColumn.innerHTML = ""
    progressColumn.innerHTML = ""
    doneColumn.innerHTML = ""

    state.tasks.forEach(task => {

        const taskEl = document.createElement("div")
        taskEl.className = "task"
        taskEl.draggable = true
        taskEl.dataset.id = task.id

        taskEl.addEventListener("dragstart", dragStart)

        /* Task Text */

        const textEl = document.createElement("span")
        textEl.textContent = task.text
        textEl.className = "task-text"

        /* Enable Editing */

        textEl.addEventListener("click", () => {
            enableEdit(textEl, task.id)
        })

        /* Delete Button */

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "X"
        deleteBtn.className = "delete-btn"

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id)
        })

        taskEl.appendChild(textEl)
        taskEl.appendChild(deleteBtn)

        document.getElementById(task.status).appendChild(taskEl)

    })

    saveState()
}

/* ---------------- ADD TASK ---------------- */

function addTask(text) {

    const task = {
        id: Date.now(),
        text: text,
        status: "todo"
    }

    state.tasks.push(task)

    render()
}

addBtn.addEventListener("click", () => {

    const text = input.value.trim()

    if (!text) return

    addTask(text)

    input.value = ""
})

/* ---------------- DELETE TASK ---------------- */

function deleteTask(id) {

    state.tasks = state.tasks.filter(task => task.id !== id)

    render()
}

/* ---------------- EDIT TASK ---------------- */

function enableEdit(element, id) {

    const input = document.createElement("input")

    input.type = "text"
    input.value = element.textContent
    input.className = "edit-input"

    element.replaceWith(input)

    input.focus()

    input.addEventListener("blur", () => saveEdit(input, id))

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            saveEdit(input, id)
        }
    })
}

function saveEdit(input, id) {

    const newText = input.value.trim()

    if (!newText) {
        render()
        return
    }

    const task = state.tasks.find(t => t.id === id)

    if (task) {
        task.text = newText
    }

    render()
}

/* ---------------- DRAG ---------------- */

function dragStart(e) {
    e.dataTransfer.setData("id", e.target.dataset.id)
}

/* ---------------- DROP ---------------- */

function dropTask(e) {

    const id = e.dataTransfer.getData("id")

    const task = state.tasks.find(t => t.id == id)

    if (!task) return

    task.status = e.currentTarget.id

    render()
}

document.querySelectorAll(".task-list").forEach(column => {

    column.addEventListener("dragover", (e) => {
        e.preventDefault()
        column.classList.add("drag-over")
    })

    column.addEventListener("dragleave", () => {
        column.classList.remove("drag-over")
    })

    column.addEventListener("drop", (e) => {
        column.classList.remove("drag-over")
        dropTask(e)
    })

})

/* ---------------- STORAGE ---------------- */

function saveState() {
    localStorage.setItem("kanbanState", JSON.stringify(state))
}

function loadState() {

    const saved = localStorage.getItem("kanbanState")

    if (saved) {
        Object.assign(state, JSON.parse(saved))
    }

    render()
}

loadState()