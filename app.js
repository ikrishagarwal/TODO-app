/* eslint-disable no-undef */
"use strict";

const moonSVG = `<svg
xmlns="http://www.w3.org/2000/svg" style="transform: scale(0.85);" viewBox="0 0 512 512" onclick="changeTheme(event)" fill="white">
<path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z" />
</svg>`;

const sunSVG = `<svg
xmlns="http://www.w3.org/2000/svg"
width="24"
height="24"
viewBox="0 0 24 24"
onclick="changeTheme(event)"
>
  <path
    d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
  ></path>
</svg>`;

// REGISTER THE SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

// SAVE THE TODO TO LOCAL STORAGE/FORAGE
const saveTodo = async (todoList) => {
  await localforage.
    setItem("todoList", JSON.stringify(todoList)).
    catch(() => null);
};

const getTodo = async () => {
  let todoList;
  if (localforage.getItem("todoList")) {
    todoList = JSON.parse(await localforage.getItem("todoList").catch((e) => {
      console.error(e);
      return [];
    }));
  }
  return todoList || [];
};

// FORM SUBMITTED AND NOW ADD IT AS A NEW TODO
const formSubmit = async (e) => {
  try {
    e.preventDefault();
  } catch (error) {}

  let input = document.querySelector("#input");
  let content = input.value.trim();
  let todoList = await getTodo();

  if (!content) return;

  input.value = "";

  if (todoList.find(a => a.content === content)) return;

  createTodo({content, completed: false});

  todoList.push({ content, completed: false });
  await saveTodo(todoList);
};

const createTodo = (item) => {
  let todo = document.createElement("div");
  todo.classList.add("todo");

  let html = `
  <p class="content">${item.content}</p>
  <div class="buttons">
  <button onclick="done(event)" class="done">
  <img src="./assets/done.svg" alt="done" />
  </button>
  <button onclick="deleteTodo(event)" class="delete">
  <img src="./assets/delete.svg" alt="delete" />
  </button>
  </div>
  `;

  todo.innerHTML = html;

  let TODOs = document.querySelector("#TODOs");
  TODOs.insertAdjacentElement("afterbegin", todo);

  if (item.completed){
    todo.classList.toggle("todo-done");
  }
}

// TODO COMPLETED
const done = async (e) => {
  const todo = e.target.closest(".todo");
  todo.classList.toggle("todo-done");

  const content = todo.querySelector(".content").textContent;
  let todoList = await getTodo();

  let index = -1;
  todoList.find((a, i) => {
    if (a.content === content) {
      index = i;
      return true;
    }
  });

  if (todo.classList.contains("todo-done") && index !== -1) {
    todoList[index].completed = true; 
  } else if (!todo.classList.contains("todo-done") && index !== -1) {
    todoList[index].completed = false;
  }

  await saveTodo(todoList);
};

// DELETE TODO
const deleteTodo = async (e) => {
	const todo = e.target.closest(".todo");
  todo.classList.add("todo-delete");
  const content = todo.querySelector(".content").textContent;
  const todoList = await getTodo();

  let index = -1;
  todoList.find((a, i) => {
    if (a.content === content) {
      index = i;
      return true;
    }
  });

  window.setTimeout(async () => {
    const TODOs = document.querySelector("#TODOs");
    TODOs.removeChild(todo);

    if (index !== -1) {
      todoList.splice(index, 1);
      await saveTodo(todoList);
    }
  }, 800);
};

// Disabling eslint for this because this function is called from the DOM
const changeTheme = () => {
  const body = document.querySelector("body");

  body.classList.toggle("darkmode");
  body.classList.toggle("lightmode");

  localforage.
    setItem("darkmode", body.classList.contains("darkmode")).catch(() => null);

  const themeCheck = document.querySelector("#theme-check");

  if (body.classList.contains("darkmode")) themeCheck.innerHTML = moonSVG;
  else if (body.classList.contains("lightmode")) themeCheck.innerHTML = sunSVG;
};

const init = async () => {
  // FORM FOR ADDING TODOs
  const formHolder = document.querySelector("#input-container");
  formHolder.addEventListener("submit", formSubmit);

  // ADDING EVENT TO DONE BUTTON
  const doneBtn = document.querySelectorAll(".done");
  doneBtn.forEach((btn) => {
    btn.addEventListener("click", done);
  });

  // ADDING EVENT TO DELETE BUTTON
  const deleteBtn = document.querySelectorAll(".delete");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", deleteTodo);
  });

  // CHANGING THE THEME

  let darkMode = await localforage.getItem("darkmode").catch(() => false);

  if (darkMode) {
    document.body.classList.remove("lightmode");
    document.body.classList.add("darkmode");
    document.querySelector("#theme-check").innerHTML = moonSVG;
  } else {
    document.body.classList.add("lightmode");
    document.body.classList.remove("darkmode");
    document.querySelector("#theme-check").innerHTML = sunSVG;
  }

  // TODOs ARRAY
  let initTodo = await getTodo();

  if (!initTodo.length) {
    initTodo = [];
    initTodo.push(
      {content: "Have fun :)", completed: false},
      {content: "There's also a dark mode", completed: false},
      {content: "Start listing your works", completed: false},
      {content: "Welcome to this TO-DO app", completed: false},
    );
    await saveTodo(initTodo);
  }

  initTodo.forEach((todo) => {
    createTodo(todo);
  });
};

window.addEventListener("DOMContentLoaded", init);
