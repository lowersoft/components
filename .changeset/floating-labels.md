---
'@lowersoft/lw': minor
---

Add `floating` to `<lw-text-input>`, `<lw-password-input>`, `<lw-number-input>` and `<lw-textarea>`: the label sits inside the box over the empty control and rises, smaller, once the field is focused, typed in, set or autofilled, lined up with the value after any icon or button. The placeholder waits until the label is out of its way, text at the ends moves onto the value's line, and a textarea scrolls its text under a strip rather than the raised label. `floating` takes keywords: `border` keeps the field at its usual height and raises the label onto the top border, centred on its line and starting where the text does, with the border and focus ring parting around it on any background; `always` keeps the label raised with the placeholder showing.
