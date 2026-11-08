---
'@lowersoft/lw': minor
---

Add `<lw-select>`: the library's select, a field-like button that opens a menu of options, each with an optional line of detail. A disabled option can say why in a tooltip. It follows the WAI-ARIA menu button pattern, opens in the top layer and takes part in forms like a native select: `value` is submitted, `required` is checked, and `error` marks it invalid from outside. It comes in three sizes and shares the label, hint and error of the text fields. The build region in `<lw-create-project-form>` is now an `<lw-select>`, with the same look.
