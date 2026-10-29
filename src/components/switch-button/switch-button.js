import { reducedMotion } from '../../core/motion.js';
import { adoptDocumentStyles } from '../../core/styles.js';
import { appliedTheme, setTheme, watchTheme } from '../../core/theme.js';
import { LwButton } from '../button/button.js';
import buttonStyles from '../button/button.scss?inline';
import revealStyles from './reveal.scss?inline';
import styles from './switch-button.scss?inline';

const REVEAL_ATTRIBUTE = 'data-lw-reveal';
const REVEAL_DURATION = 500;
const REVEAL_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const root = document.documentElement;

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315]
  .map((degrees, i) => {
    const angle = (degrees * Math.PI) / 180;
    const point = (radius) => [12 + radius * Math.cos(angle), 12 + radius * Math.sin(angle)].map((n) => n.toFixed(2));
    const [x1, y1] = point(7.5);
    const [x2, y2] = point(10);
    return `<line class="ray" style="--i: ${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  })
  .join('');

const ICON = `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><mask id="moon"><rect x="-4" y="-4" width="32" height="32" fill="white"/><circle class="bite" cx="17" cy="7" r="7.5" fill="black"/></mask><g mask="url(#moon)"><circle class="disc" cx="12" cy="12" r="4.75" fill="currentColor"/></g><g stroke="currentColor" stroke-width="2" stroke-linecap="round">${RAYS}</g></svg>`;

let revealing = false;

// Spread the new theme from the button as a circle with the View Transitions API.
const reveal = (button, apply) => {
  if (!document.startViewTransition || reducedMotion.matches || revealing) {
    apply();
    return;
  }

  const { left, top, width, height } = button.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  adoptDocumentStyles(revealStyles);
  root.toggleAttribute(REVEAL_ATTRIBUTE, true);
  revealing = true;

  const transition = document.startViewTransition(apply);
  transition.ready.then(
    () =>
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: REVEAL_DURATION, easing: REVEAL_EASING, pseudoElement: '::view-transition-new(root)' },
      ),
    () => {},
  );
  transition.finished
    .finally(() => {
      root.removeAttribute(REVEAL_ATTRIBUTE);
      revealing = false;
    })
    .catch(() => {});
};

/**
 * Light/dark theme toggle. The sun morphs into a moon and the new theme
 * spreads from the button as a circle. It sets `data-theme` on <html>, which
 * the lw theme reads; listen to `lw-theme-change` to sync other systems, or
 * cancel it to apply the theme yourself.
 *
 * @attr {boolean} no-reveal - Switches without the circular reveal
 * @attr {string} light-label
 * @attr {string} dark-label - Also the accessible name of the toggle
 * @attr {'light'|'dark'} theme - The applied theme (read only)
 * @fires lw-theme-change - Before the theme changes. `detail.theme` is the new theme. Cancelable.
 */
export class LwSwitchButton extends LwButton {
  static styles = [buttonStyles, styles];
  static props = {
    ...LwButton.props,
    noReveal: { type: Boolean },
    lightLabel: { default: 'Light' },
    darkLabel: { default: 'Dark' },
  };

  render() {
    return `<button class="button" part="button">${ICON}<span class="labels" aria-hidden="true"><span class="label label-light"></span><span class="label label-dark"></span></span></button>`;
  }

  connected() {
    super.connected();
    const sync = () => {
      const theme = appliedTheme();
      this.setAttribute('theme', theme);
      this.query('button').setAttribute('aria-pressed', String(theme === 'dark'));
    };
    sync();
    watchTheme(sync, this.signal);
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('lightLabel')) this.query('.label-light').textContent = this.lightLabel;
    if (changed.has('darkLabel')) {
      this.query('.label-dark').textContent = this.darkLabel;
      this.query('button').ariaLabel = this.darkLabel;
    }
  }

  handleClick(event) {
    super.handleClick(event);
    const theme = appliedTheme() === 'dark' ? 'light' : 'dark';
    if (!this.emit('theme-change', { theme })) return;

    const apply = () => setTheme(theme);
    if (this.noReveal) apply();
    else reveal(this.query('button'), apply);
  }
}
