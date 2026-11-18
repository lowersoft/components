import '../src/components/forum-nav-sidebar/index.js';
import '../src/components/forum-navbar/index.js';
import '../src/components/forum-sidebar/index.js';
import { attributes } from './attributes.js';

/**
 * Puts a page in the forum, the way it sits on the real site: in
 * `<lw-forum-nav-sidebar>`, under the forum navbar, signed in with `user`
 * if any, and beside the forum sidebar, closed with `closed`, both on the
 * page at `current`; the two join into one frame once the page scrolls.
 */
export const forumFrame = (page, { current = '/', user, closed } = {}) =>
  `<lw-forum-nav-sidebar><lw-forum-navbar slot="navbar" ${attributes({ current, user })}></lw-forum-navbar><lw-forum-sidebar slot="sidebar" ${attributes({ current, closed })}></lw-forum-sidebar>${page}</lw-forum-nav-sidebar>`;
