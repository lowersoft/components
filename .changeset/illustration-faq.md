---
'@lowersoft/lw': minor
---

Add `<lw-illustration-faq>`: a FAQ beside a big question mark drawn as a glossy stroke with depth, floating slowly between two outlined ghosts of itself, with square question cards on the other side. One answer is open at a time: its card fills, its chevron turns and a dot marks each corner. The question mark and dots take the text colour or `--lw-illustration-faq-accent`. This adds `core/accordion.js` and the `accordion` mixin, the question rows, one-open state, folding panels and arrow keys the FAQ sections share; `<lw-minimal-faq>` now uses them too, unchanged in behaviour.
