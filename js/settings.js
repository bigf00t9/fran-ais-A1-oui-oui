// settings.js: the Settings screen.
// For now it only has the French voice section (Milestone 3).
window.App = window.App || {};

App.settings = {
  // Help text shown when the browser has no French voice.
  NO_VOICE_HELP:
    "<strong>No French voice found.</strong> Sentences will be read with a non-French voice. " +
    "To fix this:<ul>" +
    "<li><strong>Easiest:</strong> use Google Chrome or Microsoft Edge, which include French voices.</li>" +
    "<li><strong>Windows:</strong> Settings → Time &amp; Language → Speech → Add voices → Français (France). Then restart your browser.</li>" +
    "<li><strong>Mac:</strong> System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → French. Then restart your browser.</li>" +
    "</ul>",

  NOT_SUPPORTED_HELP:
    "<strong>This browser cannot read text aloud.</strong> Please use a recent Chrome, Edge, Firefox or Safari.",

  // Fill the voice dropdown with the French voices we found.
  renderVoices: function () {
    const select = document.getElementById("voice-select");
    const warning = document.getElementById("voice-warning");
    const homeWarning = document.getElementById("home-voice-warning");
    const voices = App.speech.frenchVoices;

    select.innerHTML = "";
    voices.forEach(function (voice, index) {
      const option = document.createElement("option");
      option.value = voice.name;
      // The list is sorted best-first, so the first one is our recommendation.
      option.textContent = voice.name + " (" + voice.lang + ")" + (index === 0 ? " · recommended" : "");
      option.selected = App.speech.chosenVoice && voice.name === App.speech.chosenVoice.name;
      select.appendChild(option);
    });

    if (voices.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No French voice available";
      select.appendChild(option);
    }
    select.disabled = voices.length === 0;

    // Show or hide the warnings.
    const missing = !App.speech.isSupported() || voices.length === 0;
    warning.hidden = !missing;
    warning.innerHTML = App.speech.isSupported() ? App.settings.NO_VOICE_HELP : App.settings.NOT_SUPPORTED_HELP;
    homeWarning.hidden = !missing;
  },

  start: function () {
    const select = document.getElementById("voice-select");
    const textBox = document.getElementById("voice-test-text");

    select.addEventListener("change", function () {
      App.speech.chooseVoice(select.value);
      App.speech.speak(textBox.value); // play straight away so the difference is easy to hear
    });

    document.getElementById("voice-test").addEventListener("click", function () {
      App.speech.speak(textBox.value);
    });

    document.getElementById("voice-test-slow").addEventListener("click", function () {
      App.speech.speakSlow(textBox.value);
    });

    // Redraw the list whenever the browser finishes loading (or changes) its voices.
    App.speech.onVoicesChanged(App.settings.renderVoices);
    App.settings.renderVoices();
  }
};
