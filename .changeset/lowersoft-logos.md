---
'@lowersoft/lw': minor
---

Show Lowersoft's own logos where components carry a brand. The footers with a brand (sitemap, social, status, signature, spotlight and pixel) take `logo` and `logo-dark` and show the Lowersoft lockup by default, black in a light theme and white in a dark one; the editorial footer shows the one-line wordmark over its tagline, the eclipse hero the white lockup, and the logo tiles of the account chooser and split sign-up logins and the product stage and work flow heroes the round mark. An empty `logo` brings back the brand's initial and name. A new `--lw-show-light` / `--lw-show-dark` pair of theme tokens, with the `.light-only` and `.dark-only` classes every component shares, shows artwork drawn for one scheme only in the theme it suits.
