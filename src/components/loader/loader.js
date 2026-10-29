import { LwElement } from '../../core/lw-element.js';
import styles from './loader.scss?inline';

/**
 * A loading state: four rings sweep around at their own speeds over a title
 * and an optional subtitle, which screen readers hear as they change. With
 * reduced motion the rings pulse instead of spinning. The rings take the
 * text color, so set `color` to tint them.
 *
 * @attr {string} heading
 * @attr {string} subtitle - Set it empty to show the heading alone
 * @attr {'sm'|'md'|'lg'} size
 * @csspart rings
 * @csspart heading
 * @csspart subtitle
 */
export class LwLoader extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Configuring your account...' },
    subtitle: { default: 'Please wait while we prepare everything for you' },
    size: { default: 'md', reflect: true },
  };

  render() {
    return '<div class="rings" part="rings" aria-hidden="true"><span class="ring outer"></span><span class="ring primary"></span><span class="ring counter"></span><span class="ring accent"></span></div><output class="text" aria-live="polite"><span class="heading" part="heading"></span><span class="subtitle" part="subtitle"></span></output>';
  }

  updated() {
    this.query('.heading').textContent = this.heading;
    const subtitle = this.query('.subtitle');
    subtitle.textContent = this.subtitle;
    subtitle.hidden = !this.subtitle;
  }
}
