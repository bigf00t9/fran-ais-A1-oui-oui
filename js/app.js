// app.js: starts the app and switches between screens.
// All app code lives under one global object, "App", so names never clash.
window.App = window.App || {};

// The names of all screens. Each one matches a <section data-screen="..."> in index.html.
App.SCREENS = ["home", "session", "stats", "settings"];

// Show one screen and hide all the others.
App.showScreen = function (name) {
  // If the name is unknown (for example a typo in the address bar), go home.
  if (!App.SCREENS.includes(name)) {
    name = "home";
  }

  document.querySelectorAll(".screen").forEach(function (section) {
    section.hidden = section.dataset.screen !== name;
  });

  // Highlight the matching link in the top bar.
  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.classList.toggle("active", link.dataset.screen === name);
  });

  window.scrollTo(0, 0);

  // Stop any French still being read aloud from the previous screen.
  App.speech.stop();

  // Opening the session screen starts a fresh round of listening practice.
  // (In Milestone 8 this becomes the full four-part session.)
  if (name === "session") {
    App.listening.begin();
  }
};

// Read the screen name from the address bar: ".../index.html#stats" gives "stats".
App.currentScreenFromAddress = function () {
  return window.location.hash.replace("#", "") || "home";
};

App.start = function () {
  // Start each part of the app. Settings must start before speech,
  // so it is already listening when the voice list arrives.
  App.settings.start();
  App.speech.start();
  App.listening.start();

  // Links like href="#stats" change the part of the address after "#".
  // The browser does NOT reload the page for that; it fires a "hashchange"
  // event instead, and we show the matching screen. This also makes the
  // browser's Back and Forward buttons work.
  window.addEventListener("hashchange", function () {
    App.showScreen(App.currentScreenFromAddress());
  });

  // Show the right screen when the page first opens.
  App.showScreen(App.currentScreenFromAddress());
};

// Wait until the page has fully loaded before running the app.
document.addEventListener("DOMContentLoaded", App.start);
