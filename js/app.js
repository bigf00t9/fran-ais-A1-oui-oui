// app.js: starts the app.
// All app code lives under one global object, "App", so names never clash.
window.App = window.App || {};

App.start = function () {
  const startButton = document.getElementById("start-button");

  // For now the button only writes a note in the developer console (F12).
  // In Milestone 2 it will open the session screen.
  startButton.addEventListener("click", function () {
    console.log("Start button clicked. The session will be built in a later milestone.");
  });
};

// Wait until the page has fully loaded before running the app.
document.addEventListener("DOMContentLoaded", App.start);
