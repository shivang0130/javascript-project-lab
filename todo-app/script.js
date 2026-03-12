// ================= MODEL =================

const Model = {

    tasks: JSON.parse(localStorage.getItem("tasks")) || [],

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks))
    },

    addTask(text) {

        const task = {
            id: Date.now(),
            text: text,
            completed: false
        }

        this.tasks.push(task)
        this.save()

    },

    deleteTask(id) {

        this.tasks = this.tasks.filter(task => task.id !== id)
        this.save()

    },

    toggleTask(id) {

        const task = this.tasks.find(t => t.id === id)
        task.completed = !task.completed
        this.save()

    },

    editTask(id, newText) {

        const task = this.tasks.find(t => t.id === id)
        task.text = newText
        this.save()

    }

}


// ================= VIEW =================

const View = {

    list: document.getElementById("taskList"),
    input: document.getElementById("taskInput"),

    render(tasks) {

        this.list.innerHTML = ""

        tasks.forEach(task => {

            const li = document.createElement("li")

            if (task.completed) li.classList.add("completed")

            li.innerHTML = `
<span>${task.text}</span>

<div>
<button class="complete">Toogle Status</button>
<button class="edit">Edit</button>
<button class="delete">Delete</button>
</div>
`

            li.dataset.id = task.id

            this.list.appendChild(li)

        })

    }

}


// ================= CONTROLLER =================

const Controller = {

    init() {

        View.render(Model.tasks)

        document.getElementById("addBtn")
            .addEventListener("click", this.addTask)

        View.input.addEventListener("keydown", (e) => {

            if (e.key === "Enter") this.addTask()

        })

        View.list.addEventListener("click", this.handleListClick)

    },

    addTask() {

        const text = View.input.value.trim()

        if (!text) return

        Model.addTask(text)

        View.input.value = ""

        View.render(Model.tasks)

    },

    handleListClick(e) {

        const li = e.target.closest("li")

        if (!li) return

        const id = Number(li.dataset.id)

        if (e.target.classList.contains("delete")) {

            li.classList.add("fade-out")

            setTimeout(() => {

                Model.deleteTask(id)
                View.render(Model.tasks)

            }, 300)

        }

        if (e.target.classList.contains("complete")) {

            Model.toggleTask(id)
            View.render(Model.tasks)

        }

        if (e.target.classList.contains("edit")) {

            const span = li.querySelector("span")

            const newText = prompt("Edit task", span.textContent)

            if (newText) {

                Model.editTask(id, newText)
                View.render(Model.tasks)

            }

        }

    }

}


Controller.init()