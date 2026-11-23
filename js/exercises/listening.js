// listening.js: the listening (dictation) exercise.
// The browser reads a French sentence aloud, the learner types it, and we
// show word by word what was right and wrong.
window.App = window.App || {};

App.listening = {
  sentences: [], // the sentences for this round, in order
  index: 0,      // which sentence we are on
  score: 0,      // how many were fully correct
  state: "idle", // "answering", "answered" or "finished"

  el: function (id) {
    return document.getElementById(id);
  },

  current: function () {
    return App.listening.sentences[App.listening.index];
  },

  // Mix a list into random order (Fisher–Yates shuffle).
  shuffle: function (list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  },

  // Start a new round with every sample sentence, in random order.
  begin: function () {
    App.listening.sentences = App.listening.shuffle(FR_DATA.sentences);
    App.listening.index = 0;
    App.listening.score = 0;
    App.listening.el("listening-finished").hidden = true;
    App.listening.showQuestion();
  },

  showQuestion: function () {
    const total = App.listening.sentences.length;
    App.listening.el("listening-progress").textContent =
      "Sentence " + (App.listening.index + 1) + " of " + total;

    App.listening.el("listening-question").hidden = false;
    App.listening.el("listening-feedback").hidden = true;

    const input = App.listening.el("listening-input");
    input.value = "";
    input.disabled = false;
    input.focus();

    App.listening.state = "answering";
    App.listening.replay(false); // play the sentence straight away
  },

  replay: function (slow) {
    const sentence = App.listening.current();
    if (!sentence) return;
    if (slow) {
      App.speech.speakSlow(sentence.fr);
    } else {
      App.speech.speak(sentence.fr);
    }
  },

  check: function () {
    const sentence = App.listening.current();
    const input = App.listening.el("listening-input");
    const result = App.grading.compare(sentence.fr, input.value, { lenientAccents: false });

    if (result.correct) App.listening.score++;

    input.disabled = true;
    input.blur(); // so Space replays and Enter moves on
    App.listening.state = "answered";

    const headline = App.listening.el("listening-result");
    headline.textContent = result.correct ? "✓ Correct!" : "✗ Not quite. Have a look below.";
    headline.className = "result-headline " + (result.correct ? "good" : "bad");

    App.listening.renderDiff(App.listening.el("listening-diff"), result.items);
    App.listening.el("listening-correct").textContent = sentence.fr;
    App.listening.el("listening-english").textContent = "“" + sentence.en + "”";

    App.listening.el("listening-question").hidden = true;
    App.listening.el("listening-feedback").hidden = false;
  },

  // Draw the word-by-word comparison as coloured words.
  renderDiff: function (container, allItems) {
    container.innerHTML = "";

    // Show a correct elided word and the correct word after it as one word:
    // "s'" + "il" → "s'il".
    const items = [];
    allItems.forEach(function (item) {
      const last = items[items.length - 1];
      if (last && last.type === "correct" && item.type === "correct" && last.expected.endsWith("'")) {
        items[items.length - 1] = {
          type: "correct",
          expected: last.expected + item.expected,
          accentNote: last.accentNote || item.accentNote
        };
      } else {
        items.push(item);
      }
    });

    items.forEach(function (item, position) {
      const word = document.createElement("span");
      word.classList.add("word");

      if (item.type === "correct") {
        word.classList.add("word-correct");
        word.textContent = item.expected;
        if (item.accentNote) {
          word.classList.add("word-accent");
          word.title = "Right, but watch the accent";
        }
      } else if (item.type === "wrong") {
        word.classList.add("word-wrong");
        const typed = document.createElement("s");
        typed.textContent = item.typed;
        const fix = document.createElement("strong");
        fix.textContent = item.expected;
        word.append(typed, " → ", fix);
        word.title = item.accentOnly ? "Only the accent is wrong" : "Wrong word";
        if (item.accentOnly) word.append(" (accent)");
      } else if (item.type === "missing") {
        word.classList.add("word-missing");
        word.textContent = item.expected;
        word.title = "You missed this word";
      } else if (item.type === "extra") {
        word.classList.add("word-extra");
        const typed = document.createElement("s");
        typed.textContent = item.typed;
        word.append(typed);
        word.title = "This word is not in the sentence";
      }

      // Put a space between words, except after an elided word like "j'".
      const previous = items[position - 1];
      const previousText = previous ? (previous.expected || previous.typed) : "";
      if (position > 0 && !previousText.endsWith("'")) container.append(" ");
      container.appendChild(word);
    });

    if (items.length === 0) container.textContent = "(nothing typed)";
  },

  next: function () {
    App.listening.index++;
    if (App.listening.index < App.listening.sentences.length) {
      App.listening.showQuestion();
    } else {
      App.listening.finish();
    }
  },

  finish: function () {
    App.listening.state = "finished";
    App.speech.stop();
    App.listening.el("listening-question").hidden = true;
    App.listening.el("listening-feedback").hidden = true;
    App.listening.el("listening-finished").hidden = false;
    App.listening.el("listening-progress").textContent = "Done";
    App.listening.el("listening-score").textContent =
      "Listening done: " + App.listening.score + " / " + App.listening.sentences.length + " correct";
  },

  // Keyboard shortcuts. Only active while the session screen is showing.
  handleKey: function (event) {
    if (App.listening.el("screen-session").hidden) return;
    const state = App.listening.state;
    const typing = event.target === App.listening.el("listening-input");
    const isSpace = event.code === "Space" || event.key === " ";

    if (event.key === "Enter") {
      event.preventDefault(); // stops Enter from also pressing whatever button has focus
      if (state === "answering") App.listening.check();
      else if (state === "answered") App.listening.next();
      else if (state === "finished") App.listening.begin();
      return;
    }

    if (event.key === "Escape" && typing) {
      event.target.blur();
      return;
    }

    if (isSpace && state !== "finished") {
      if (event.ctrlKey) {
        // Ctrl+Space works everywhere, even while typing. Add Shift for slow.
        event.preventDefault();
        App.listening.replay(event.shiftKey);
      } else if (!typing) {
        // Plain Space replays, but only outside the text box (inside it types a space).
        event.preventDefault();
        App.listening.replay(event.shiftKey);
      }
    }
  },

  // After clicking a button, put the cursor back where it is useful.
  refocus: function () {
    if (App.listening.state === "answering") {
      App.listening.el("listening-input").focus();
    } else if (document.activeElement) {
      document.activeElement.blur();
    }
  },

  start: function () {
    App.accentBar.attach(App.listening.el("listening-accents"), App.listening.el("listening-input"));

    App.listening.el("listening-replay").addEventListener("click", function () {
      App.listening.replay(false);
      App.listening.refocus();
    });
    App.listening.el("listening-slow").addEventListener("click", function () {
      App.listening.replay(true);
      App.listening.refocus();
    });
    App.listening.el("listening-check").addEventListener("click", App.listening.check);
    App.listening.el("listening-next").addEventListener("click", App.listening.next);
    App.listening.el("listening-again").addEventListener("click", App.listening.begin);

    document.addEventListener("keydown", App.listening.handleKey);
  }
};
