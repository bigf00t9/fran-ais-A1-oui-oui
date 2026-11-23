// accent-bar.js: a row of buttons that type French accented letters.
// Click to insert the letter where the cursor is. Shift-click for a capital letter.
window.App = window.App || {};

App.accentBar = {
  LETTERS: ["é", "è", "ê", "à", "ç", "ô", "û", "î", "ï"],

  // Build the buttons inside "container"; they type into "input".
  attach: function (container, input) {
    container.innerHTML = "";
    App.accentBar.LETTERS.forEach(function (letter) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "accent-button";
      button.textContent = letter;
      button.tabIndex = -1; // skip these when pressing Tab, so Tab goes straight to other buttons
      button.title = "Insert " + letter + " (Shift-click for " + letter.toUpperCase() + ")";

      // Stop the click from taking the cursor out of the text box.
      button.addEventListener("mousedown", function (event) {
        event.preventDefault();
      });

      button.addEventListener("click", function (event) {
        if (input.disabled) return;
        const text = event.shiftKey ? letter.toUpperCase() : letter;
        input.focus();
        // Replace any selected text (or nothing) at the cursor with the letter.
        input.setRangeText(text, input.selectionStart, input.selectionEnd, "end");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      container.appendChild(button);
    });
  }
};
