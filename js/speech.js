// speech.js: French text-to-speech using the browser's built-in voices.
// Uses the Web Speech API (window.speechSynthesis). No internet service, no cost.
window.App = window.App || {};

App.speech = {
  NORMAL_RATE: 0.9, // 1 is the browser's normal speed; slightly slower is easier to follow
  SLOW_RATE: 0.6,

  frenchVoices: [],  // every French voice this browser has
  chosenVoice: null, // the one we speak with
  listeners: [],     // functions to call when the voice list is ready or changes

  // Is text-to-speech available in this browser at all?
  isSupported: function () {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  },

  // Some browsers write the language as "fr_FR" instead of "fr-FR"; treat them the same.
  langOf: function (voice) {
    return (voice.lang || "").replace("_", "-").toLowerCase();
  },

  // A score for how good a voice is likely to be. Higher is better.
  // France French (fr-FR) beats other French (Canada, Belgium, Switzerland),
  // and names like "Google", "Natural" or "Premium" usually sound more natural.
  scoreVoice: function (voice) {
    let score = 0;
    if (App.speech.langOf(voice) === "fr-fr") score += 10;
    if (/google|natural|neural|premium|enhanced|online/i.test(voice.name)) score += 5;
    return score;
  },

  // Read the browser's voice list and keep only the French ones, best first.
  loadVoices: function () {
    const allVoices = window.speechSynthesis.getVoices();
    App.speech.frenchVoices = allVoices
      .filter(function (voice) { return App.speech.langOf(voice).startsWith("fr"); })
      .sort(function (a, b) { return App.speech.scoreVoice(b) - App.speech.scoreVoice(a); });

    // Keep the voice the learner picked if it still exists; otherwise use the best one.
    const stillThere = App.speech.chosenVoice && App.speech.frenchVoices.find(function (voice) {
      return voice.name === App.speech.chosenVoice.name;
    });
    App.speech.chosenVoice = stillThere || App.speech.frenchVoices[0] || null;

    App.speech.listeners.forEach(function (callback) { callback(); });
  },

  // Let other parts of the app (like the Settings screen) know when voices change.
  onVoicesChanged: function (callback) {
    App.speech.listeners.push(callback);
  },

  hasFrenchVoice: function () {
    return App.speech.frenchVoices.length > 0;
  },

  // Pick a voice by its name (used by the voice list in Settings).
  chooseVoice: function (name) {
    const found = App.speech.frenchVoices.find(function (voice) { return voice.name === name; });
    if (found) App.speech.chosenVoice = found;
  },

  // Say some French text out loud at the given speed.
  speakAtRate: function (text, rate) {
    if (!App.speech.isSupported()) return;

    // Stop anything still being said, so replays never pile up.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR"; // even with no French voice, ask for French pronunciation
    utterance.rate = rate;
    if (App.speech.chosenVoice) utterance.voice = App.speech.chosenVoice;

    window.speechSynthesis.speak(utterance);
  },

  speak: function (text) {
    App.speech.speakAtRate(text, App.speech.NORMAL_RATE);
  },

  speakSlow: function (text) {
    App.speech.speakAtRate(text, App.speech.SLOW_RATE);
  },

  start: function () {
    if (!App.speech.isSupported()) {
      App.speech.listeners.forEach(function (callback) { callback(); });
      return;
    }

    // Browsers load their voice list in the background, so at first the list
    // can be empty. Chrome and Edge fire "voiceschanged" when it is ready.
    window.speechSynthesis.addEventListener("voiceschanged", App.speech.loadVoices);
    App.speech.loadVoices();

    // Some browsers never fire that event, so check again a few times.
    [250, 1000, 3000].forEach(function (delay) {
      setTimeout(App.speech.loadVoices, delay);
    });
  }
};
