---
'@lowersoft/lw': minor
---

Add `<lw-forum-categories>`: a forum's categories in titled groups, each in the kanban board's column frame with its title, count and description over a card of rows. A category's row holds its icon, or a square in the colour the forum sidebar gives it, its name and description, its sub-forums as label pills, its thread and message counts, and the thread posted in last with when and by whom, the member's card opening over their name. Unread categories have their icon inverted and a bolder name, private ones a lock, empty ones say so. The whole row leads to the category, a group's heading folds it away (`lw-toggle`), long lists of sub-forums show the first few and a button for the rest, the rows fit the room the component has rather than the window with their columns labelled once in the group's head, and the times count on while the page stays open. The issue lists' label pill is now the `label-chip` mixin.
