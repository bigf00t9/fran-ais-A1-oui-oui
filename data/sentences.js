// data/sentences.js: French sentences, used by the listening exercise
// (and later by sentence practice).
//
// Rules (see CLAUDE.md):
// - Every sentence has a stable "id" that never changes (saved progress is linked to it).
// - Numbers are written as words, so the expected answer in listening is clear.
// - "alt" lists other correct French translations of the English sentence.
window.FR_DATA = window.FR_DATA || {};

FR_DATA.sentences = [
  {
    id: "s-greet-01", theme: "greetings", level: "A1",
    fr: "Bonjour, je m'appelle Claire.",
    en: "Hello, my name is Claire.",
    alt: ["Bonjour, mon nom est Claire."]
  },
  {
    id: "s-food-01", theme: "food", level: "A1",
    fr: "Je voudrais un café, s'il vous plaît.",
    en: "I would like a coffee, please.",
    alt: ["Je voudrais un café, s'il te plaît."]
  },
  {
    id: "s-family-01", theme: "family", level: "A1",
    fr: "Ma sœur habite à Lyon avec son mari.",
    en: "My sister lives in Lyon with her husband.",
    alt: []
  },
  {
    id: "s-time-01", theme: "time", level: "A1",
    fr: "Aujourd'hui, nous sommes le douze mars.",
    en: "Today is the twelfth of March.",
    alt: ["Aujourd'hui, on est le douze mars.", "Aujourd'hui, c'est le douze mars."]
  },
  {
    id: "s-routine-01", theme: "routine", level: "A1",
    fr: "Le matin, je prends le bus pour aller au travail.",
    en: "In the morning, I take the bus to go to work.",
    alt: ["Le matin, je prends le bus pour aller travailler."]
  },
  {
    id: "s-directions-01", theme: "directions", level: "A1",
    fr: "Excusez-moi, où est la gare ?",
    en: "Excuse me, where is the train station?",
    alt: ["Pardon, où est la gare ?", "Excusez-moi, où se trouve la gare ?"]
  }
];
