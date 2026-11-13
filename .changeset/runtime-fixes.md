---
'@lowersoft/lw': patch
---

Fix smaller runtime bugs. `<lw-work-flow-hero>` no longer throws on a step with an unknown icon. A modal opened again while it fades out stays open instead of closing under its `open` attribute. `<lw-newsletter-footer>` and `<lw-pixel-footer>` send a sign-up once when Enter is pressed again while it is sending. Invalid JSON in an attribute now names the element and attribute in its error, and a property set to `NaN` again no longer counts as a change. Text from data is escaped in `<lw-date-range-brush>`'s busiest day, `<lw-carousel-cards>`' price and review count, the issue status and priority marks, and the workspace mark colour.
