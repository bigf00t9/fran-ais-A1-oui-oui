# CLAUDE.md: notes for future sessions

## What this project is
A desktop browser app for a **10-minute daily French session**: listening dictation → noun genders → verb conjugation → sentence practice. It uses Leitner spaced repetition, streaks and stats. The learner has passed A1 and is aiming for A2.

- **Full requirements:** [`docs/PRD.md`](docs/PRD.md). Read it before building any feature; it is the source of truth.
- **Build plan:** [`docs/ROADMAP.md`](docs/ROADMAP.md). Work on the **next unticked milestone** only, and tick it once its "Test it" checks pass.

## About the owner
The owner is a **complete beginner at coding**. So:
- Explain what you changed in plain language, without jargon, or explain the jargon in one line.
- After every change, give simple steps to **test it in the browser**: what to click and what should happen.
- Keep changes small, one milestone (or less) at a time. Don't start the next milestone without being asked.
- Prefer simple, readable code over clever code. Add short comments explaining *why* the code does something.
- If a requirement is unclear, ask instead of guessing. Suggest changes to the PRD; don't make them silently.

## Tech stack and hard rules
- **Plain HTML, CSS and JavaScript only.** No frameworks (React, Vue…), no TypeScript, no build step, no npm/package installs, no bundlers.
- Must run on **GitHub Pages** *and* when `index.html` is opened directly from disk (`file://`). Because of that:
  - Load scripts with ordinary `<script src="…">` tags in a fixed order. **Don't use ES modules** (`type="module"`) or `fetch()` for local files, because both fail on `file://`.
  - Data files are `.js` files that attach data to a global object, not `.json` files.
- **No accounts, no server, no paid APIs.** Text-to-speech uses the browser's built-in `speechSynthesis` with a `fr-FR` voice.
- **Progress lives in `localStorage`**, under the single key `frenchDaily.v1`, as one JSON object with a `schemaVersion` field. Export/Import uses a `.json` file. Always handle missing or broken data without crashing.
- **Desktop only.** Design for screens ≥ 1024 px; no mobile layout in v1.
- No external libraries or CDNs. Charts are drawn with plain HTML/CSS or SVG.
- **Not in v1:** login, mobile layout, AI feedback, speech-recognition grading.

## File structure (planned)
```
index.html              # the only page; has a container for each screen
css/
  style.css             # all styles
js/
  app.js                # starts the app, switches between screens, keyboard shortcuts
  storage.js            # load/save localStorage, export/import, schema version
  dates.js              # "today" (supports the developer pretend-date), day maths
  speech.js             # French text-to-speech: choose voice, speak, speak slowly
  grading.js            # normalising text, word-by-word comparison, accent leniency
  srs.js                # Leitner boxes: due items, promote/demote
  session.js            # builds today's session, tracks progress, summary
  streak.js             # streak and streak-freeze rules
  stats.js              # the stats page
  settings.js           # the settings page, export/import/reset, dev tools
  ui/accent-bar.js      # accent buttons that insert into the focused text box
  exercises/
    listening.js
    genders.js
    conjugation.js
    sentences.js
data/
  nouns.js              # 150+ nouns
  gender-rules.js       # ending-based gender tips and exceptions
  verbs.js              # 25+ verbs
  sentences.js          # 80+ sentences (used by listening and sentence practice)
docs/
  PRD.md
  ROADMAP.md
```
All app code sits under one global namespace, `window.App` (for example `App.speech.speak()`), so that nothing clashes. Data sits under `window.FR_DATA`.

## Data file formats
Every item has a **stable `id`** that must never change, because saved progress is linked to it. When adding items, give them new ids; never reuse or rename old ones.

```js
// data/nouns.js
window.FR_DATA = window.FR_DATA || {};
FR_DATA.nouns = [
  { id: "n-maison", word: "maison", gender: "f", en: "house", theme: "home", level: "A1", elision: false },
  { id: "n-arbre",  word: "arbre",  gender: "m", en: "tree",  theme: "nature", level: "A1", elision: true }, // l'arbre → always asked as un/une
];

// data/gender-rules.js
FR_DATA.genderRules = [
  { id: "r-tion", ending: "tion", gender: "f", tip: "-tion → usually feminine", examples: ["la nation", "la station"], exceptions: [] },
  { id: "r-ee",   ending: "ée",   gender: "f", tip: "-ée → usually feminine",   examples: ["la journée", "l'idée"],    exceptions: ["musée", "lycée"] },
];

// data/verbs.js
FR_DATA.verbs = [
  {
    id: "v-aller", infinitive: "aller", en: "to go", group: "irregular", level: "A1",
    present: { je: "vais", tu: "vas", il: "va", nous: "allons", vous: "allez", ils: "vont" },
    participle: "allé", auxiliary: "être"
  },
];
// elle/on use the "il" form, and elles uses the "ils" form.
// The app works out elision (j'ai, j'aime) and être agreement (allé/allée/allés/allées).

// data/sentences.js
FR_DATA.sentences = [
  {
    id: "s-greet-01", theme: "greetings", level: "A1",
    fr: "Bonjour, je m'appelle Claire.",
    en: "Hello, my name is Claire.",
    alt: ["Bonjour, mon nom est Claire."]   // other accepted translations
  },
];
```
Sentence themes: `greetings, family, food, shopping, time, directions, routine, hobbies, travel`.

## French content rules
- The French must be **correct and natural**. Double-check genders, accents, agreement and elision. If you're unsure about an item, leave it out.
- Use standard French typography (`’`/`'` apostrophes, accents on capitals where usual). Grading ignores punctuation.
- Write numbers as words in listening sentences.
- Mostly A1, with some A2, and tag every item with `level`.
- Avoid nouns whose meaning depends on gender (*le/la tour*) and nouns used only in the plural.

## Coding conventions
- 2-space indentation, `const`/`let` (never `var`), semicolons, double quotes.
- Small functions with clear names. Keep French content out of code files; it belongs in `data/`.
- Dates are stored as `"YYYY-MM-DD"` strings in the learner's local time. Always get "today" from `App.dates.today()` so that the developer pretend-date works.
- Keyboard: Enter = submit/continue, 1/2 = le/la, Space = replay (when not typing), Ctrl+Space = replay while typing, Esc = leave the text box.
- Before saying a milestone is done, open the page, make sure the console has no errors, and run the milestone's "Test it" list. Playwright and Chromium are available in the cloud environment for automated checks. Note that text-to-speech may be silent in a headless browser.

## Git
- Commit in small steps with clear messages, such as "M4: listening exercise with word-by-word grading".
