---
'@lowersoft/lw': minor
---

Add `<lw-confirm-delete-button>`: the button grows into a card that names what goes with the deletion, with an optional type-the-name step and a hairline that folds the card back when you walk away. The morph between a button and a floating view is now shared through `core/morph.js`, and the build no longer puts every helper into the core chunk, so pages load only the helpers their components use.
