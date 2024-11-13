"use strict";
var _a;
const setState = (key, value) => {
    if (typeof value == "string") {
        localStorage.setItem(key, value);
    }
    else {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
const getState = (key) => {
    const data = localStorage.getItem(key);
    if (data != null) {
        try {
            return JSON.parse(data);
        }
        catch (error) {
            return data;
        }
    }
};
let elForm = document.querySelector(".todo-form");
let elInput = document.querySelector(".todo-input");
let elList = document.querySelector(".todo-list");
let elAllList = document.querySelector(".all-list");
let elComplatedList = document.querySelector(".complated-list");
let elUnComplatedList = document.querySelector(".uncomplated-list");
let elAllWrapper = (_a = elAllList === null || elAllList === void 0 ? void 0 : elAllList.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
let ID = 0;
let todos = getState("todos") || [];
elAllWrapper === null || elAllWrapper === void 0 ? void 0 : elAllWrapper.addEventListener("click", function (e) {
    if (e.target.classList.contains("all-list-btn")) {
        renderTodos(todos, elList);
    }
    else if (e.target.classList.contains("complate-btn")) {
        const filteredArr = todos.filter(item => item.isComlated == true);
        renderTodos(filteredArr, elList);
    }
    else if (e.target.classList.contains("uncomplate-btn")) {
        const filteredArr = todos.filter(item => item.isComlated == false);
        renderTodos(filteredArr, elList);
    }
});
elForm === null || elForm === void 0 ? void 0 : elForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
        id: ID++,
        value: elInput.value,
        isComlated: false
    };
    todos.push(data);
    renderTodos(todos, elList);
    e.target.reset();
    setState("todos", todos);
});
function renderTodos(arr, list) {
    list.innerHTML = ``;
    const totalTodos = todos.length;
    const completedCount = todos.filter(item => item.isComlated).length;
    arr.forEach((item, index) => {
        let elItem = document.createElement("li");
        elItem.className = `flex items-center justify-between p-2 bg-slate-200 rounded-md ${item.isComlated ? "opacity-60 line-through" : ""}`;
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
        list.append(elItem);
        elItem.addEventListener("click", function (e) {
            if (e.target.matches(".delete-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == e.target.id);
                todos.splice(findedIndex, 1);
                renderTodos([...todos], elList);
                setState("todos", [...todos]);
            }
            else if (e.target.matches(".uptade-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == e.target.id);
                if (findedIndex !== -1) {
                    elInput.value = todos[findedIndex].value;
                    renderTodos(todos, elList);
                    setState("todos", todos);
                    todos.splice(findedIndex, 1);
                }
            }
        });
    });
    elAllList.textContent = String(todos.length);
    elComplatedList.textContent = String(todos.filter(item => item.isComlated == true).length);
    elUnComplatedList.textContent = String(todos.filter(item => item.isComlated != true).length);
    const completedPercentage = totalTodos > 0 ? (completedCount / totalTodos) * 100 : 0;
    const circleChart = document.querySelector(".circle-chart");
    const percentageText = document.querySelector(".percentage-text");
    if (circleChart && percentageText) {
        circleChart.style.transition = "all 1s";
        circleChart.style.background = `conic-gradient(#4CAF50 ${completedPercentage}%, #F44336 ${completedPercentage}% 100%)`;
        percentageText.textContent = `${Math.round(completedPercentage)}%`;
    }
}
renderTodos(todos, elList);
function complateClick(id) {
    const findObj = todos.find(item => item.id == id);
    if (findObj) {
        findObj.isComlated = !findObj.isComlated;
        renderTodos([...todos], elList);
        setState("todos", [...todos]);
    }
}
