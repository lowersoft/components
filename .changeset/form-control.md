---
'@lowersoft/lw': minor
---

Every form field now has the validation API of a native control (`form`, `validity`, `validationMessage`, `willValidate`, `checkValidity()`, `reportValidity()`) from a shared `FormControl` mixin in `core/form.js`. Callback properties such as `search` or `formatValue` now survive being set before the element upgrades.
