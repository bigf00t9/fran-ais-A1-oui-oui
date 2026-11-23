# Roadmap

The app is built in small steps called **milestones**. After each milestone you can open the app in a browser and check that it works, using the **"Test it"** list.

**Rules for working through this roadmap**
- Build **one milestone at a time**, in order.
- At the end of each milestone, the app must still open without errors, and everything from earlier milestones must still work.
- Tick the box (`[x]`) when the "Test it" checks all pass.
- **How to open the app:** double-click `index.html`, or visit the GitHub Pages link once Milestone 1 is done.
- **How to check for errors:** press **F12** (or **Cmd + Option + J** on a Mac) to open the browser's developer console. A red message means something is broken.

The full requirements are in [`PRD.md`](./PRD.md).

---

## Phase A: Foundations

### [ ] M1. Hello page, live on GitHub Pages
**Build:** `index.html`, `css/style.css` and `js/app.js` with a title, a short welcome line and a "Start today's session" button that does nothing yet. Turn on GitHub Pages for the repository.
**Test it:**
- Opening `index.html` shows the title and the button, centred on a desktop-sized page.
- The GitHub Pages link shows the same page.
- The console shows no errors.

### [ ] M2. Moving between screens
**Build:** a simple way to switch between screens without reloading the page: **Home**, **Session** (placeholder), **Stats** (placeholder) and **Settings** (placeholder), with a top navigation bar.
**Test it:**
- Clicking each menu item shows the right screen, and the browser does not reload.
- "Start today's session" opens the Session placeholder.

### [ ] M3. The browser speaks French
**Build:** `js/speech.js`, which chooses a fr-FR voice and has `speak(text)` and `speakSlow(text)` functions. Add a test button to the Settings screen that says a sample sentence, plus a list of available voices to pick from. Show a warning if no French voice is found.
**Test it:**
- Clicking "Test voice" says *"Bonjour, comment ça va ?"* in a French voice.
- "Slow" is clearly slower.
- The voice list shows the French voices your computer has, and picking a different one changes the sound.

---

## Phase B: The four exercises (each one tested alone, with a little sample content)

### [ ] M4. Listening exercise
**Build:** the listening screen, using about 5 sample sentences in `data/sentences.js`. It includes Replay and Slow buttons, a text box, accent buttons, and word-by-word grading in `js/grading.js`.
**Test it:**
- The sentence plays automatically when it appears.
- Replay and Slow both work. **Space** replays when the cursor is not in the text box, and **Ctrl + Space** replays while typing.
- Clicking **é** puts é where the cursor is.
- Type the sentence without the full stop and press **Enter**: it is marked correct.
- Type one word wrong: that word turns red and the correct word is shown. Leave a word out: it is marked "missing".
- Upper/lower case and `’` vs `'` make no difference.

### [ ] M5. Genders exercise
**Build:** the genders screen, using about 20 sample nouns in `data/nouns.js` and a few rules in `data/gender-rules.js`.
**Test it:**
- Press **1** or **2** to answer. Clicking also works.
- Feedback shows the full phrase, such as "la maison".
- A noun ending in *-tion* shows the "-tion → usually feminine" tip.
- A noun starting with a vowel, such as *arbre*, is asked as **un/une**, not le/la.
- **Enter** moves to the next noun.

### [ ] M6. Conjugation exercise (present tense)
**Build:** the conjugation screen, using about 5 sample verbs in `data/verbs.js` (être, avoir, aller, parler, finir).
**Test it:**
- "nous + aller" with the answer "allons" is correct, and "nous allons" is also accepted.
- "je + avoir" with the answer "ai" or "j'ai" is correct, and the feedback shows "j'ai".
- A wrong answer shows the full table for that verb.

### [ ] M7. Sentence practice
**Build:** the three-step screen (write it → say it out loud → reveal and listen), plus the Y/N self-grade buttons.
**Test it:**
- Typing the exact answer is marked correct automatically.
- Typing an accepted alternative is also correct.
- Typing a different sentence shows the comparison and the "Was yours correct?" buttons, and **Y** / **N** work.
- The correct sentence is read aloud when revealed.

---

## Phase C: Making it a daily habit

### [ ] M8. The full daily session
**Build:** link the four parts together, with a progress bar and the item counts from the PRD. Add the **"Session complete"** screen with each part's score and the mistakes from today.
**Test it:**
- "Start today's session" runs Listening → Genders → Conjugation → Sentences in that order.
- The progress bar moves forward.
- At the end, the summary shows the right scores and lists your mistakes.

### [ ] M9. Saving progress, and resuming a session
**Build:** `js/storage.js`, which saves to and loads from `localStorage`. Save the session after each answer. Add the developer tool "pretend today is…" to Settings.
**Test it:**
- Answer a few items, refresh the page, and the app offers to resume where you left off.
- Finish the session and refresh: the home screen says "Done for today ✓".
- Set the pretend date to tomorrow: a new session is available.
- Change localStorage to nonsense (in the developer tools) and reload: the app starts fresh with a warning and does not crash.

### [ ] M10. Spaced repetition (Leitner boxes)
**Build:** `js/srs.js`, with 5 boxes, due dates, and wrong items repeated near the end of a part. Sessions choose due items first.
**Test it (using the pretend date):**
- Get a noun wrong today; it comes back tomorrow.
- Get a noun right on several days in a row; it comes back after 2, then 4, then 8 days.
- A temporary debug panel shows each item's box and due date.

### [ ] M11. Streaks and streak freezes
**Build:** the streak counter on the home screen. Earn a freeze at 7, 14, 21 days and so on, hold at most 2, and use them automatically.
**Test it (using the pretend date):**
- Finish sessions on 3 days in a row: the streak shows 3.
- Skip a day without a freeze: the streak goes back to 0.
- Reach 7 days: a freeze is earned and shown.
- Skip one day: the freeze is used, the streak continues, and a message explains this.

### [ ] M12. Stats page
**Build:** a section for each skill with overall accuracy, a 30-day bar chart and the 10 weakest items. Also show the overall streak and session numbers and how many items are in each box.
**Test it:**
- After a few (pretend) days of sessions, the bars appear on the right days.
- Getting the same noun wrong several times puts it in that skill's weakest list.

### [ ] M13. Settings, Export and Import
**Build:** all the settings from the PRD (lenient accents, speed, items per part, un/une mode), plus Export, Import and Reset.
**Test it:**
- With lenient accents on, "ete" for *été* is correct and shows a note about the accent.
- **Export** downloads a `.json` file.
- **Reset**, then **Import** that file: all progress, streak and stats come back exactly as before.
- Importing a random non-backup file shows an error, and the current data is unchanged.

---

## Phase D: Full content

French content is added in batches so that each batch can be checked carefully.

### [ ] M14. Nouns and gender rules
**Build:** reach **150+ nouns** across the themes, and about 15 gender rules with exceptions.
**Test it:**
- A count shown in the developer tools is 150 or more.
- Play several gender rounds: the words feel varied, and the tips are accurate.

### [ ] M15. Verbs
**Build:** reach **25+ verbs** with full present tables, past participles and auxiliaries.
**Test it:**
- The verb count is 25 or more.
- Spot-check the irregular verbs (être, avoir, aller, faire, pouvoir, vouloir, devoir, venir, prendre) against a conjugation reference.

### [ ] M16. Sentences
**Build:** reach **80+ sentences**, at least 8 per theme, each with accepted alternative translations.
**Test it:**
- The sentence count is 80 or more, and every theme has at least 8.
- Listen to 10 random sentences: each one sounds natural.

---

## Phase E: Levelling up

### [ ] M17. Passé composé and futur proche
**Build:** conjugation levels 2 (passé composé with avoir and être) and 3 (futur proche). Levels unlock automatically at 70% of items in box 3 or higher, or manually in Settings.
**Test it:**
- Unlock manually: prompts such as "elle + venir (passé composé)" appear.
- "est venue" and "est venu" are both accepted for *elle*, and "elle est venue" is shown as the main answer.
- "je + manger (futur proche)" with the answer "vais manger" is correct.
- The session-complete screen announces when a level is unlocked.

### [ ] M18. Polish and final checks
**Build:** a "?" keyboard-shortcut help popup, a tidy visual design, clear focus outlines, and any remaining edge cases.
**Test it:**
- Go through every item in the PRD's "Success criteria" (§14) and tick it.
- A complete session using only the keyboard takes about 10 minutes.
- Test on GitHub Pages in Chrome and Firefox.

---

## Later (not version 1)
- Checking pronunciation with speech recognition in the speaking step
- More tenses (imparfait, futur simple)
- More themes and A2 content
- A mobile layout
