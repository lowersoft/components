---
'@lowersoft/lw': minor
---

Name the last kebab-case properties in camelCase, like every other property: `footnoteLink` and `footnoteHref` on `<lw-credit-plan-pricing>`, `guaranteeTitle` on `<lw-flat-rate-pricing>`, `questionHref` on `<lw-lifetime-pricing>` and `accentHeading` on `<lw-nested-feature-pricing>`. Their attributes are unchanged; code that set `element['footnote-link']` and the like now sets `element.footnoteLink`.
