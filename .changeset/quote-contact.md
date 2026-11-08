---
'@lowersoft/lw': minor
---

Add `<lw-quote-contact>`: a contact form beside a customer's word. The headline sits over a name, email and message form built from the library's fields; beside it, a quote card on a soft glow carries the product's mark, the quote with its key phrase in bold, the customer's logo and arrows to step through quotes. This adds `core/contact.js`, the send flow the contact sections share: the fields check themselves, an optional async `send` runs while the button waits, a rejection shows its message, and a success clears the form, says `sent` and fires `lw-send`, plus the `contact-status` and `quiet-labels` mixins.
