# Product Requirements Document: French Daily Practice

**Status:** Draft v1 · **Last updated:** 2026-11-23

---

## 1. Summary

A desktop browser app for a **10-minute daily French session**. It helps a learner who has passed A1 keep reviewing, move toward A2, and get comfortable speaking and writing full sentences.

Each session has four parts, in this order:

| # | Part | Target time | Skill practised |
|---|------|-------------|-----------------|
| 1 | Listening dictation | ~3 min | Listening and spelling |
| 2 | Noun genders | ~2 min | le/la, un/une |
| 3 | Verb conjugation | ~3 min | Present tense, later passé composé and futur proche |
| 4 | Sentence practice | ~2 min | Writing and speaking |

The app runs entirely in the browser. There is no server, no account, and nothing to install. It is hosted on GitHub Pages.

## 2. The user

- One person: an adult learner who has passed the A1 tests.
- **Goals:** keep A1 fresh, stretch toward A2, and build confidence producing whole sentences.
- **Weakest areas:** listening, noun genders, verb conjugations.
- **Habit:** one short session per day on a laptop or desktop computer.

## 3. Goals and non-goals

### Goals
1. A complete, useful session in about 10 minutes, every day, with no setup.
2. Extra practice on weak items through spaced repetition.
3. A visible habit loop (streak, "done" screen, stats) that makes the learner want to come back.
4. French content that is correct and natural, and easy to add to.

### Not in version 1
- Accounts or login
- A mobile layout (desktop only)
- AI feedback on answers
- Speech-recognition grading (possibly in a later version)
- Any paid API or server

## 4. The daily session in detail

A session is a fixed number of items per part. This keeps it close to 10 minutes without a countdown timer creating pressure. The item counts can be changed in settings.

| Part | Default items |
|------|---------------|
| Listening | 6 sentences |
| Genders | 15 nouns |
| Conjugation | 12 prompts |
| Sentence practice | 3 sentences |

**Choosing items:** each part fills its list with items that are **due** under spaced repetition (see §5). If too few are due, it adds **new** items, easiest level first. If there are still too few, it adds the items that are due soonest.

**Progress bar:** a bar at the top shows the current part and how far through it the learner is.

**Leaving and coming back:** if the learner closes the tab mid-session, the session is saved. Reopening the app the same day offers to **resume** it. An unfinished session from an earlier day is thrown away. Answers already given still count toward spaced repetition and stats.

### 4.1 Listening (~3 min)

1. The browser reads a short French sentence aloud with the built-in Web Speech API (`speechSynthesis`), using a **fr-FR** voice.
2. The learner types what they heard in a text box.
3. Controls:
   - **Replay** button, played at normal speed (rate ≈ 0.9)
   - **Replay slowly** button (rate ≈ 0.6)
   - **Accent buttons** under the text box (see §6)
4. Press **Enter** to submit.
5. **Grading** (see §7) ignores missing punctuation and capital letters. It then shows the learner's answer next to the correct sentence, word by word:
   - correct words in green
   - wrong words in red, with the correct word shown
   - missing words marked as missing
   - extra words struck through
6. The sentence counts as correct only if every word matches. Accent-only mistakes count as correct when lenient accent mode is on.
7. The English meaning is shown after the answer is checked.

**If no French voice is available:** show a clear message on the home screen, such as "Your browser has no French voice installed", with a short tip on how to add one. Listening still works with the default voice, but the warning stays visible.

### 4.2 Genders (~2 min)

1. A noun is shown, for example **maison**, with its English meaning in small text underneath.
2. The learner chooses the article:
   - Press **1** for **le** (or **un**) and **2** for **la** (or **une**). The answers can also be clicked.
   - The prompt uses **le/la** for most nouns. For nouns that start with a vowel or a silent *h* (where French writes *l'*), it always uses **un/une**, because *l'arbre* would give the answer away. A setting allows "always un/une".
3. Immediate feedback: correct or wrong, plus the full phrase, such as "**la** maison".
4. **Gender tip:** if a rule applies to the noun, show it. Examples:
   - "-tion → usually feminine (la nation, la station)"
   - "-ment → usually masculine (le moment, le médicament)"
   - Known exceptions are flagged, such as "⚠ Exception: le musée is masculine even though it ends in -ée."
5. Press **Enter** or **Space** to go to the next noun.

### 4.3 Conjugation (~3 min)

1. A prompt shows a pronoun and a verb, for example **nous + aller** (present). The tense is always labelled.
2. The learner types the verb form: "allons". Typing the pronoun as well ("nous allons") is also accepted.
3. For *je* before a vowel, both "ai" and "j'ai" are accepted, and the feedback shows "j'ai".
4. Feedback shows the correct form. A wrong answer also shows the full conjugation table for that verb and tense.
5. **Verbs included:**
   - Irregular: être, avoir, aller, faire, pouvoir, vouloir, devoir, venir, prendre
   - Regular -er (e.g. parler, aimer, manger, habiter, travailler, regarder, écouter)
   - Regular -ir (e.g. finir, choisir, réussir)
   - Regular -re (e.g. vendre, attendre, répondre, entendre)
   - At least **25 verbs** in total
6. **Pronouns:** je, tu, il, elle, on, nous, vous, ils, elles
7. **Levels:**
   - **Level 1:** présent (unlocked from the start)
   - **Level 2:** passé composé with *avoir* and with *être*. For *être* verbs, both agreements are accepted, such as "je suis allé" or "je suis allée".
   - **Level 3:** futur proche, such as "je vais manger"
   - A level unlocks **automatically** when 70% of the previous level's items are in Leitner box 3 or higher. It can also be unlocked **manually** in settings.
   - Once a level is unlocked, prompts from all unlocked levels are mixed, with more weight on the newest level.

### 4.4 Sentence practice (~2 min)

Each sentence has three steps.

1. **Write it:** an English sentence is shown. The learner types a French translation and presses **Enter**.
2. **Say it:** the screen says "Now say your sentence out loud." There is no recording or grading; this step is only for speaking practice. Press **Enter** to continue.
3. **Reveal and listen:** the correct French sentence is shown and read aloud automatically, with Replay and Replay-slowly buttons. The learner's written answer is compared with the correct version, word by word, in the same style as listening.

**Self-grading:** many translations can be correct. Each sentence stores a main answer and a list of accepted alternatives.
- If the answer matches one of them, it is marked correct automatically.
- If it does not match, the app asks **"Was yours correct?"** with two buttons: **Yes, mine was fine (Y)** and **No, I got it wrong (N)**. The learner's choice is recorded.

## 5. Spaced repetition (Leitner boxes)

Every item has its own progress record: each sentence used for listening, each noun, each verb + pronoun + tense combination, and each translation sentence.

There are five boxes. Each box sets how long to wait before the item comes back:

| Box | Comes back after |
|-----|------------------|
| 1 | same session if possible, otherwise 1 day |
| 2 | 2 days |
| 3 | 4 days |
| 4 | 8 days |
| 5 | 16 days |

- **Correct answer:** the item moves up one box (it stays in box 5 if already there).
- **Wrong answer:** the item goes back to box 1.
- **New items** start in box 1.
- **Wrong in this session:** an item answered wrongly is shown once more near the end of the same part, if there is room. Only the first answer counts for the box.
- Each item stores: `box`, `due` (a date), `timesSeen`, `timesCorrect`, `timesWrong`, `lastSeen`.

## 6. Typing French: accent buttons and leniency

- A row of accent buttons appears under every text box: **é è ê à ç ô û î ï**. More can be added later: **â ë ù œ**.
- Clicking a button inserts the letter where the cursor is and keeps the cursor in the text box. Shift-click inserts the capital letter.
- **Lenient accents** (setting, off by default): an answer that differs only by accents counts as correct, but the feedback still points out the accent, for example "✓ Correct. Watch the accent: *été*."

## 7. Grading rules

Before comparing, both the answer and the correct text are **normalised**:
1. Trim spaces and turn runs of spaces into a single space.
2. Lower-case everything.
3. Remove punctuation: `. , ! ? ; : « » " ( ) …` and dashes used as punctuation. Hyphens inside words, such as *est-ce que* and *grand-mère*, are kept.
4. Treat `’` (curly) and `'` (straight) apostrophes as the same. Split elided words after the apostrophe so that *j'ai* is compared as "j'" + "ai".
5. If lenient accents is on, also remove accents for the right/wrong check. The original text is kept for display.

**Word-level comparison:** the two word lists are lined up so that each word is labelled *correct*, *wrong*, *missing* or *extra*. This uses a longest-common-subsequence diff, which is a standard way to line up two lists.

**Numbers:** listening sentences avoid digits. Numbers are written as words so that the expected answer is clear.

## 8. Content (built in)

All French content lives in separate data files (see `CLAUDE.md` for the format). Content is mostly A1, with some A2 stretch items. Every item has a `level` tag, `"A1"` or `"A2"`.

| Type | Minimum amount | Notes |
|------|----------------|-------|
| Nouns | **150** | gender, English meaning, theme, level, and whether it takes *l'* |
| Gender rules | ~15 | ending-based tips with examples and known exceptions |
| Verbs | **25** | full present tables, past participle, which auxiliary (avoir/être) |
| Sentences | **80** | French, English, accepted alternative translations, theme, level |

**Sentence themes** (at least 8 sentences each): greetings, family, food, shopping, time and dates, directions, daily routine, hobbies, travel.

**Quality rules:**
- French must be correct and sound natural, the way a French speaker would say it, not word-for-word from English.
- Use standard spelling: apostrophes, accents, and a space before `? ! : ;` where French typography uses one. Grading ignores punctuation anyway.
- Listening sentences are 4–12 words. Translation sentences are 4–14 words.
- Avoid nouns that are only plural, or whose gender changes the meaning (*le/la tour*), unless the meaning is shown clearly.
- Every item has a stable `id` that never changes. Saved progress is linked to that id.

## 9. Motivation

### 9.1 Daily streak
- The streak goes up by 1 on each calendar day (the learner's local time) when the **full** session is finished.
- Missing a day resets the streak to 0, unless a streak freeze covers it.

### 9.2 Streak freeze
- The learner **earns one freeze for every 7 days of streak** (at 7, 14, 21 and so on).
- They can **hold at most 2** freezes.
- If a day is missed and a freeze is held, it is **used automatically** and the streak continues. The home screen says "A streak freeze saved your streak yesterday ❄️".
- One freeze covers one missed day. Two missed days in a row use two freezes.

### 9.3 "Today's session done" screen
Shown when the fourth part is finished:
- A big "Session complete ✓" heading and the current streak (🔥 12 days)
- The score for each part, such as "Listening 5/6 · Genders 13/15 · Conjugation 10/12 · Sentences 2/3"
- The items the learner got wrong today, with the correct answers
- Any level unlocked or freeze earned today
- Buttons: **See stats** and **Practise more** (an optional extra round that does not change the streak)

After the session is done, the home screen shows "Done for today ✓" with the summary. A small link still allows extra practice.

### 9.4 Stats page
- **For each skill** (listening, genders, conjugation, sentences):
  - overall accuracy
  - accuracy over time: a simple bar chart of the last 30 days, drawn with plain HTML/CSS or SVG, with no chart library
  - **weakest items:** the 10 items with the most wrong answers and lowest box
- **Overall:** current streak, longest streak, freezes held, total sessions, and the number of items in each Leitner box

## 10. Keyboard shortcuts (desktop)

| Key | Action |
|-----|--------|
| **Enter** | Submit answer / continue to next |
| **1** / **2** | Choose le (un) / la (une) in Genders |
| **Space** | Replay audio, when the cursor is **not** in a text box |
| **Ctrl + Space** | Replay audio while typing in a text box |
| **Ctrl + Shift + Space** | Replay slowly while typing |
| **Esc** | Move the cursor out of the text box (so Space replays) |
| **Y** / **N** | Self-grade in sentence practice |

The shortcuts are listed on screen in small text, and in a "?" help popup.

## 11. Settings

- Lenient accents (on/off)
- Normal and slow speech speed
- Choice of French voice (from the voices the browser has)
- Number of items per part
- Genders: le/la vs always un/une
- Unlock conjugation levels manually
- **Export progress** (downloads a `.json` backup file)
- **Import progress** (loads a backup file, shows what it contains, and asks for confirmation before replacing the current data)
- Reset all progress (asks for confirmation twice)
- *Developer tools* (hidden behind a "Show developer tools" toggle): pretend today is a different date, so that streaks and spaced repetition can be tested

## 12. Saving data

- Everything is stored in the browser's `localStorage` under one key, `frenchDaily.v1`, as one JSON object with a `schemaVersion` number.
- Saved data includes: settings, a progress record for each item, streak data, daily stats history, and today's session (for resuming).
- If saved data is missing or broken, the app starts fresh and does not crash. It shows a warning if the data was broken.
- **Export** makes a file named like `french-progress-2026-11-23.json`. **Import** checks that the file is valid before using it.

## 13. Technical constraints

- Plain **HTML, CSS and JavaScript** only: no frameworks, no build step, no npm installs.
- Must run on **GitHub Pages**, and should also work when `index.html` is opened directly from the computer.
- No server, no accounts, no paid APIs. Text-to-speech uses the browser's built-in voices.
- Target browsers: recent Chrome, Edge, Firefox and Safari on desktop. Chrome and Edge usually have the best French voices.
- Designed for screens 1024 px wide or larger.

## 14. Success criteria for version 1

- [ ] A full session takes 8–12 minutes for this learner.
- [ ] All four parts work with keyboard only.
- [ ] Spaced repetition: an item answered wrongly comes back the next day; an item answered correctly several times in a row comes back less often.
- [ ] The streak and freezes behave correctly across missed days (tested with the developer date tool).
- [ ] Export → Reset → Import gives back exactly the same progress.
- [ ] Content counts reach the minimums in §8, and the French has been reviewed for correctness.
- [ ] The app works on GitHub Pages in Chrome and Firefox.

## 15. Open questions

1. **Ctrl + Space on Mac:** on macOS this combination often switches keyboard language. If it clashes, use another shortcut, such as Alt + R.
2. **Voice quality** varies a lot between browsers and operating systems. Should the app recommend a browser?
3. **Speaking step:** a later version could use the browser's speech recognition to check pronunciation (not in v1).
