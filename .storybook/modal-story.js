import { attributes } from './attributes.js';

/** A modal story: a button that opens it, and the modal itself, open at first. */
export const modalStory = (tag, label = 'Open') => (args) =>
  `<lw-button onclick="this.nextElementSibling.open = true">${label}</lw-button><${tag} ${attributes(args)}></${tag}>`;
