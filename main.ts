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
    isComlated: boolean
}

let elForm: Element | null = document.querySelector(".todo-form")
let elInput: Element | null = document.querySelector(".todo-input")
let elList: Element | null = document.querySelector(".todo-list")

let elAllList: Element | null = document.querySelector(".all-list")
let elComplatedList: Element | null = document.querySelector(".complated-list")
let elUnComplatedList: Element | null = document.querySelector(".uncomplated-list")
let elAllWrapper = elAllList?.parentElement?.parentElement

let ID: number = 0
let todos: TodoType[] = getState("todos") || []

elAllWrapper?.addEventListener("click", function(e: Event){
    if((e.target as HTMLButtonElement).classList.contains("all-list-btn")){
        renderTodos(todos, elList)
    }
    else if((e.target as HTMLButtonElement).classList.contains("complate-btn")){
        const filteredArr = todos.filter(item => item.isComlated == true)
        renderTodos(filteredArr, elList)
    }
    else if((e.target as HTMLButtonElement).classList.contains("uncomplate-btn")){
        const filteredArr = todos.filter(item => item.isComlated == false)
        renderTodos(filteredArr, elList)
    }
})

elForm?.addEventListener("submit", function (e: Event) {
    e.preventDefault()
    const data: TodoType = {
        id: ID++,
        value: (elInput as HTMLInputElement).value,
        isComlated: false
    }
    todos.push(data)
    renderTodos(todos, elList);
    (e.target as HTMLFormElement).reset()
    setState("todos", todos)
})

function renderTodos(arr: TodoType[], list: Element | null) {
    (list as HTMLUListElement).innerHTML = ``

    const totalTodos = todos.length;
    const completedCount = todos.filter(item => item.isComlated).length;

    arr.forEach((item: TodoType, index: number) => {
        let elItem: Element | null = document.createElement("li")
        elItem.className = `flex items-center justify-between p-2 bg-slate-200 rounded-md ${item.isComlated ? "opacity-60 line-through" : ""}`
        elItem.innerHTML = `
        <div class="flex">
            <span>${index + 1}.</span>
            <strong>${item.value}</strong>
        </div>
        <div class="flex items-center gap-2">
            <button onclick="complateClick(${item.id})" class="rounded-full relative border-[2px] border-slate-400 w-[20px] h-[20px] cursor-pointer duration-300">
                <span class="rounded-full absolute bottom-0 right-0 top-0 left-0 border-[2px] border-slate-200 ${item.isComlated ? "bg-slate-400" : "bg-slate-200"}"></span>
            </button>
            <button id=${item.id} class="uptade-btn bg-blue-500 p-2 rounded-md text-white">Uptade</button>
            <button id=${item.id} class="delete-btn bg-red-500 p-2 rounded-md text-white">Delete</button>
        </div>
        `;
        (list as HTMLUListElement).append(elItem)

        elItem.addEventListener("click", function (e: Event) {
            if ((e.target as HTMLButtonElement).matches(".delete-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == (e.target as HTMLButtonElement).id);
                todos.splice(findedIndex, 1);
                renderTodos([...todos], elList);
                setState("todos", [...todos]);
            } else if ((e.target as HTMLButtonElement).matches(".uptade-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == (e.target as HTMLButtonElement).id);
                if (findedIndex !== -1) {
                    (elInput as HTMLInputElement).value = todos[findedIndex].value;
                    renderTodos(todos, elList);
                    setState("todos", todos);
                    todos.splice(findedIndex, 1);
                }
            }
        });
    });
    (elAllList as HTMLSpanElement).textContent = String(todos.length);
    (elComplatedList as HTMLSpanElement).textContent = String(todos.filter(item => item.isComlated == true).length);
    (elUnComplatedList as HTMLSpanElement).textContent = String(todos.filter(item => item.isComlated != true).length)

    const completedPercentage = totalTodos > 0 ? (completedCount / totalTodos) * 100 : 0;

    const circleChart = document.querySelector(".circle-chart") as HTMLElement;
    const percentageText = document.querySelector(".percentage-text") as HTMLElement;

    if (circleChart && percentageText) {
        circleChart.style.transition = "all 1s"
        circleChart.style.background = `conic-gradient(#4CAF50 ${completedPercentage}%, #F44336 ${completedPercentage}% 100%)`;
        percentageText.textContent = `${Math.round(completedPercentage)}%`;
    }
}
renderTodos(todos, elList)

function complateClick(id: Number) {
    const findObj = todos.find(item => item.id == id);
    if (findObj) {
        findObj.isComlated = !findObj.isComlated
        renderTodos([...todos], elList);
        setState("todos", [...todos]);
    }
}