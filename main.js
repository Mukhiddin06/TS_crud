"use strict";
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
let ID = 0;
let todos = getState("todos") || [];
elForm === null || elForm === void 0 ? void 0 : elForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
        id: ID++,
        value: elInput.value
    };
    todos.push(data);
    renderTodos(todos, elList);
    e.target.reset();
    setState("todos", todos);
});
function renderTodos(arr, list) {
    list.innerHTML = ``;
    arr.forEach((item, index) => {
        let elItem = document.createElement("li");
        elItem.className = "flex items-center justify-between p-2 bg-slate-200 rounded-md";
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
        list.append(elItem);
        elItem.addEventListener("click", function (e) {
            if (e.target.matches(".delete-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == e.target.id);
                todos.splice(findedIndex, 1);
                renderTodos([...todos], elList);
                setState("todos", [...todos]);
            }
        });
        elItem.addEventListener("click", function (e) {
            if (e.target.matches(".uptade-btn")) {
                const findedIndex = todos.findIndex(item => String(item.id) == e.target.id);
                if (findedIndex !== -1) {
                    elInput.value = todos[findedIndex].value; // todo qiymatini inputga o'rnatish
                    ID = todos[findedIndex].id; // eski IDni qayta ishlatish uchun IDni o'rnatish
                    todos.splice(findedIndex, 1); // todo ni ro'yxatdan olib tashlash
                    setState("todos", todos);
                    renderTodos(todos, elList);
                }
            }
        });
    });
}
renderTodos(todos, elList);
