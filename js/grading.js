// grading.js: checks a typed French answer against the correct text, word by word.
//
// Rules (from the PRD, section 7):
// - Punctuation and capital letters don't matter.
// - Curly ’ and straight ' apostrophes are the same.
// - Elided words are split after the apostrophe: "j'ai" is compared as "j'" + "ai".
// - "oe" and "œ" count as the same letters, since œ is hard to type.
// - With lenient accents on, "ete" matches "été" (but we still point out the accent).
window.App = window.App || {};

App.grading = {
  // Words that drop their vowel before another vowel: l', j', d', qu' and so on.
  // Only these are split, so "aujourd'hui" stays one word.
  ELIDING_WORDS: ["l", "j", "d", "m", "t", "s", "n", "c", "qu", "jusqu", "lorsqu", "puisqu"],

  // Turn a sentence into a list of words, keeping their original spelling for display.
  tokenize: function (text) {
    let clean = (text || "").normalize("NFC");     // make accented letters consistent
    clean = clean.replace(/[’‘ʼ`´]/g, "'");          // all apostrophes → '
    clean = clean.replace(/[.,!?;:«»"“”()\[\]…–—]/g, " "); // punctuation → space
    clean = clean.replace(/(^|\s)-+(?=\s|$)/g, " "); // a dash on its own is punctuation; "est-ce" keeps its hyphen

    const tokens = [];
    clean.split(/\s+/).filter(Boolean).forEach(function (word) {
      let rest = word;
      let match = rest.match(/^([^']+)'(.+)$/);
      while (match && App.grading.ELIDING_WORDS.includes(match[1].toLowerCase())) {
        tokens.push(match[1] + "'");
        rest = match[2];
        match = rest.match(/^([^']+)'(.+)$/);
      }
      tokens.push(rest);
    });
    return tokens;
  },

  removeAccents: function (word) {
    return word.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
  },

  // The form of a word that we actually compare.
  compareKey: function (word, ignoreAccents) {
    let key = word.toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae");
    if (ignoreAccents) key = App.grading.removeAccents(key);
    return key;
  },

  // Compare the typed answer with the correct text.
  // Returns { correct: true/false, items: [...] }, where each item is one of:
  //   { type: "correct", expected, accentNote }   accentNote: right except accents (lenient mode only)
  //   { type: "wrong",   expected, typed, accentOnly }  accentOnly: only the accents are wrong
  //   { type: "missing", expected }
  //   { type: "extra",   typed }
  compare: function (expectedText, typedText, options) {
    const lenient = Boolean(options && options.lenientAccents);
    const expected = App.grading.tokenize(expectedText);
    const typed = App.grading.tokenize(typedText);
    const expKeys = expected.map(function (w) { return App.grading.compareKey(w, lenient); });
    const typKeys = typed.map(function (w) { return App.grading.compareKey(w, lenient); });

    // Line up the two word lists using a "longest common subsequence":
    // lcs[i][j] = how many words match between expected[i..] and typed[j..].
    const n = expected.length;
    const m = typed.length;
    const lcs = [];
    for (let i = 0; i <= n; i++) lcs.push(new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        lcs[i][j] = expKeys[i] === typKeys[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
      }
    }

    // Walk through both lists, labelling each word.
    const steps = [];
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && expKeys[i] === typKeys[j]) {
        steps.push({ type: "same", expected: expected[i], typed: typed[j] });
        i++; j++;
      } else if (i < n && (j >= m || lcs[i + 1][j] >= lcs[i][j + 1])) {
        steps.push({ type: "missing", expected: expected[i] });
        i++;
      } else {
        steps.push({ type: "extra", typed: typed[j] });
        j++;
      }
    }

    // Between two matching words, a missing word plus an extra word really
    // means "you wrote this word wrongly", so pair them up as "wrong".
    const items = [];
    let missing = [];
    let extra = [];
    function flush() {
      // Join a missed elided word to the word after it ("m'" + "appelle" → "m'appelle"),
      // so "mappelle" is shown as one wrong word instead of two mistakes.
      const joined = [];
      missing.forEach(function (step) {
        const last = joined[joined.length - 1];
        if (last && last.expected.endsWith("'")) {
          last.expected += step.expected;
        } else {
          joined.push({ type: "missing", expected: step.expected });
        }
      });
      missing = joined;

      const pairs = Math.min(missing.length, extra.length);
      for (let k = 0; k < pairs; k++) {
        const exp = missing[k].expected;
        const typ = extra[k].typed;
        const accentOnly = App.grading.compareKey(exp, true) === App.grading.compareKey(typ, true);
        items.push({ type: "wrong", expected: exp, typed: typ, accentOnly: accentOnly });
      }
      missing.slice(pairs).forEach(function (s) { items.push(s); });
      extra.slice(pairs).forEach(function (s) { items.push(s); });
      missing = [];
      extra = [];
    }
    steps.forEach(function (step) {
      if (step.type === "missing") { missing.push(step); return; }
      if (step.type === "extra") { extra.push(step); return; }
      flush();
      const accentNote = App.grading.compareKey(step.expected, false) !== App.grading.compareKey(step.typed, false);
      items.push({ type: "correct", expected: step.expected, accentNote: accentNote });
    });
    flush();

    const correct = items.every(function (item) { return item.type === "correct"; });
    return { correct: correct, items: items };
  }
};
