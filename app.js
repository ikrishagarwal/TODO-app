"use strict";

// FORM SUBMITED AND NOW ADD IT AS A NEW TODO
const formSubit = (e) => {
  e.preventDefault();

  let input = document.querySelector("#input");
  let content = input.value.trim();

  if (!content) return;

  input.value = "";

  let todo = document.createElement("div");
  todo.classList.add("todo");

  let html = `
    <p class="content">${content}</p>
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
};

// TODO COMPLETED
const done = (e) => {
  const todo = e.target.parentElement.parentElement.parentElement;
  todo.classList.toggle("todo-done");
};

// DELETE TODO
const deleteTodo = (e) => {
  const todo = e.target.parentElement.parentElement.parentElement;
  todo.classList.add("todo-delete");

  window.setTimeout(() => {
    const TODOs = document.querySelector("#TODOs");
    TODOs.removeChild(todo);
  }, 800);
};

const init = () => {
  // FORM FOR ADDING TODOs
  const formHolder = document.querySelector("#input-container");
  formHolder.addEventListener("submit", formSubit);

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
};

window.addEventListener("DOMContentLoaded", init);
