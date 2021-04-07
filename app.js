"use strict";

const formSubit = (e) => {
  e.preventDefault();
};

const init = () => {
  const formHolder = document.querySelector("#input-container");
  formHolder.addEventListener("submit", formSubit);
};

window.addEventListener("DOMContentLoaded", init);
