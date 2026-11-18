import { PREFIX } from '../../core/config.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './forum-nav-sidebar.scss?inline';

/**
 * A forum's navbar and sidebar round its page, joined. At the top of the
 * page the bar spans the window and the sidebar stands under it at the
 * left, both bare. Once the page scrolls the bar shrinks to run from the
 * sidebar to the window's right edge, the sidebar rises into the room it
 * leaves, and the two take one frame flush with the window's edges: one
 * sheet of frosted glass round their panes, which keep a gap between them,
 * and a line along the bar's foot that turns down the sidebar's edge on a
 * round, the page's corner; the line draws as the two settle. Searching,
 * the bar grows down to hold its panel and the corner moves down with it.
 * Closed, the sidebar slides out, the corner with it, and the bar takes the
 * window's width, its line too. The bar's forum sections, such as Latest,
 * Media and Members, show only while the sidebar is closed.
 *
 * Put an `<lw-forum-navbar>` in the `navbar` slot and an
 * `<lw-forum-sidebar>` in the `sidebar` slot, each with its own items and
 * the page you are on; this sets `navbar` and `joined` on the sidebar,
 * which sets the navbar's `sidebar` and `joined`. The page goes in the
 * default slot, beside the sidebar, and a footer under it.
 *
 * Narrower than 64rem (1024px) the page takes the window's width, the bar
 * floats over it once the page scrolls, and the button at the start of the
 * bar opens the sidebar as a drawer from the window's left edge.
 *
 * @slot navbar - The forum's `<lw-forum-navbar>`
 * @slot sidebar - The forum's `<lw-forum-sidebar>`, under the navbar and joined with it
 * @slot - The page, and a footer under it
 * @csspart page - The page's column, beside the sidebar
 */
export class LwForumNavSidebar extends LwElement {
  static styles = styles;
  static props = {};

  render() {
    return '<slot name="navbar"></slot><div class="layout"><slot name="sidebar"></slot><div class="page" part="page"><slot></slot></div></div>';
  }

  connected() {
    // As attributes, so a sidebar not yet upgraded takes them too.
    const slot = this.query('slot[name="sidebar"]');
    const join = () => {
      for (const sidebar of slot.assignedElements()) {
        if (sidebar.localName !== `${PREFIX}-forum-sidebar`) continue;
        sidebar.toggleAttribute('navbar', true);
        sidebar.toggleAttribute('joined', true);
      }
    };
    slot.addEventListener('slotchange', join, { signal: this.signal });
    join();
  }
}
