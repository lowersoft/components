---
'@lowersoft/lw': minor
---

`<lw-floating-navbar>` signs in: `user`, as `{ name, avatar?, role?, email? }`, puts the member's `<lw-profile-dropdown>` where the actions were, an outlined button with their avatar and name and their role at the menu's head. Its menu sets the theme, so the theme switch steps aside. On a phone the button is the avatar alone and the menu drops from the top of the screen. `<lw-forum-navbar>` now takes its `user` from here, unchanged.
