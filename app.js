"use strict";

const formSubit = (e) => {
  e.preventDefault();

  let input = document.querySelector("#input");
  let content = input.value;

  input.value = "";

  let todo = document.createElement("div");
  todo.classList.add("todo");

  let html = `
    <p class="content">${content}</p>
    <div class="buttons">
      <button class="done">
        <img src="./assets/done.svg" alt="done" />
      </button>
      <button class="delete">
        <img src="./assets/delete.svg" alt="delete" />
      </button>
    </div>
  `;

  todo.innerHTML = html;

  let TODOs = document.querySelector("#TODOs");
  TODOs.insertAdjacentElement("afterbegin", todo);
};

const init = () => {
  const formHolder = document.querySelector("#input-container");
  formHolder.addEventListener("submit", formSubit);
};

window.addEventListener("DOMContentLoaded", init);
