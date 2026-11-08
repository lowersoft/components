---
'@lowersoft/lw': minor
---

Add `<lw-customer-stories>`: customer stories behind a row of company tabs, each showing the company's mark over the person's face and the company's name. The open tab is outlined in its company's colour and the outline glides between them. Below, the person's portrait card, with their name on a dark chip, sits beside their quote, set large on a panel washed in the company's colour with the library's button to the whole story, which fires `lw-read` and then follows `href`. Changing story, the panel's colour eases into the next company's, the portrait and quote blur away as the next ones come into focus word by word, and the name on the chip rolls over. Photos can replace the drawn faces. The tabs follow the WAI-ARIA tabs pattern and fire `lw-change`.
