const setState = (key: string, value: any): void => {
    if (typeof value == "string") {
        localStorage.setItem(key, value)
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}
const getState = (key: string): any => {
    const data = localStorage.getItem(key)
    if (data != null) {
        try {
            return JSON.parse(data)
        } catch (error) {
            return data
        }
    }
}

interface TodoType {
    id: number
    value: string
}

let elForm: Element | null = document.querySelector(".todo-form")
let elInput: Element | null = document.querySelector(".todo-input")
let elList: Element | null = document.querySelector(".todo-list")

let ID: number = 0
let todos: TodoType[] = getState("todos") || []

elForm?.addEventListener("submit", function (e: Event) {
    e.preventDefault()
    const data: TodoType = {
        id: ID++,
        value: (elInput as HTMLInputElement).value
    }
    todos.push(data)
    renderTodos(todos, elList);
    (e.target as HTMLFormElement).reset()
    setState("todos", todos)
})

function renderTodos(arr: TodoType[], list: Element | null) {
    (list as HTMLUListElement).innerHTML = ``
    arr.forEach((item: TodoType, index: number) => {
        let elItem: Element | null = document.createElement("li")
        elItem.className = "flex items-center justify-between p-2 bg-slate-200 rounded-md"
        elItem.innerHTML = `
        <div class="flex">
            <span>${index + 1}.</span>
            <strong>${item.value}</strong>
        </div>
        <div class="flex items-center gap-2">
            <button id=${item.id} class="uptade-btn bg-blue-500 p-2 rounded-md text-white">Uptade</button>
            <button id=${item.id} class="delete-btn bg-red-500 p-2 rounded-md text-white">Delete</button>
        </div>
        `;
        (list as HTMLUListElement).append(elItem)

        elItem.addEventListener("click", function (e: Event) {
            if ((e.target as HTMLLIElement).matches(".delete-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == (e.target as HTMLButtonElement).id)
                todos.splice(findedIndex, 1)
                renderTodos([...todos], elList)
                setState("todos", [...todos])
            }
        })
        elItem.addEventListener("click", function (e: Event) {
            if ((e.target as HTMLLIElement).matches(".uptade-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == (e.target as HTMLButtonElement).id)
                if (findedIndex !== -1) {
                    (elInput as HTMLInputElement).value = todos[findedIndex].value // todo qiymatini inputga o'rnatish
                    ID = todos[findedIndex].id // eski IDni qayta ishlatish uchun IDni o'rnatish
                    todos.splice(findedIndex, 1) // todo ni ro'yxatdan olib tashlash
                    setState("todos", todos)
                    renderTodos(todos, elList)
                }
            }
        })
    })
}
renderTodos(todos, elList)
