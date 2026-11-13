---
'@lowersoft/lw': minor
---

`<lw-profile-dropdown>` accounts take an `avatar`, a picture's URL shown in place of the initials, and the `email` is optional: without one the name stands alone, in the card, the menu's header and the account list. The card's avatar, name, email and arrows are exposed as `trigger-*` parts, so a host can restyle the card, as `<lw-forum-navbar>` does. The menu grows toward the side with room and narrows below 288px where it must, and on a phone it grows into a sheet across the top of the screen over the dimmed page, which a press on the page closes; the card narrows with its column. Opening it no longer widens the page with a horizontal scrollbar.
