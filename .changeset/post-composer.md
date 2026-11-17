---
'@lowersoft/lw': minor
---

Add `<lw-post-composer>`: a field to write a forum post in markdown. Its tools bold, italicise, strike, head, link, quote, set code and code blocks, make bulleted, numbered and task lists, mention a member and attach files, each from a shortcut too and named with its shortcut in a hint, and toggle off what they set; Enter carries lists and quotes on, @ offers the members to mention in the mention input's list, right under the @, and Preview shows the post as it will read, safely rendered. Files come from the paperclip, a drop or a paste, checked against `accept`, `max-size` and `max-files`, with a picture of each image and a button to take it off. `draft-key` keeps the draft in the browser, the count shows near `max-length`, and Post or ⌘/Ctrl and Enter fires `lw-submit` with the markdown and the files. Markdown rendering lives in `core/markdown.js`. The mention input's list now lives in `core/mention-list.js`, shared by both.
