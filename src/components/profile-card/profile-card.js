import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import '../follow-button/index.js';
import styles from './profile-card.scss?inline';

const DEMO_MUTUALS = ['Ana Ruiz', 'Leo Park', 'Sam Kato', 'Riley Moss'];
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
// Followers are shown in full, so following rolls the last digit.
const full = new Intl.NumberFormat('en-US');

/**
 * A portrait profile card with stats and mutual followers. Follow morphs
 * into Following while the follower count rolls up by one.
 *
 * Without `image`, the portrait is drawn from the name.
 *
 * @attr {string} name
 * @attr {string} handle
 * @attr {string} role - A line under the name, e.g. a job and a place
 * @attr {string} bio
 * @attr {string} image - Portrait URL
 * @attr {number} followers - Not counting this viewer
 * @attr {number} following
 * @attr {number} posts
 * @attr {Array<string>} mutuals - Names of followers you share (JSON)
 * @attr {number} mutual-count - How many followers you share in all
 * @attr {boolean} followed - This viewer follows them
 * @fires lw-change - Followed or unfollowed; `detail: { followed }`
 * @fires lw-message - Message was pressed
 */
export class LwProfileCard extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    name: { default: 'Maya Chen' },
    handle: { default: '@mayachen' },
    role: { default: 'Systems engineer · Lisbon' },
    bio: { default: 'Writing small, fast C at LowerSoft. Previously on compilers and kernel drivers. Slow coffee, fast binaries.' },
    image: { default: '' },
    followers: { type: Number, default: 12_480 },
    following: { type: Number, default: 342 },
    posts: { type: Number, default: 1_208 },
    mutuals: { type: Object, default: DEMO_MUTUALS },
    mutualCount: { type: Number, default: 14 },
    followed: { type: Boolean, reflect: true },
  };

  render() {
    return `<div class="portrait" aria-hidden="true"><img alt="" hidden><span class="initials"></span></div>
<div class="body"><p class="name"></p><p class="handle"></p><p class="role"></p><p class="bio"></p>
<dl class="stats"><div><dt>Followers</dt><dd class="followers rolling"></dd></div><div><dt>Following</dt><dd class="following-count"></dd></div><div><dt>Posts</dt><dd class="posts"></dd></div></dl>
<div class="mutuals"><span class="faces" aria-hidden="true"></span><span class="mutual-text"></span></div>
<div class="actions"><lw-follow-button class="follow"></lw-follow-button><lw-button class="message" variant="secondary">Message</lw-button></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.follow').addEventListener('lw-change', (event) => {
      this.followed = event.detail.following;
      this.emit('change', { followed: this.followed });
    }, options);
    this.query('.message').addEventListener('click', () => this.emit('message'), options);
  }

  updated() {
    const image = this.query('img');
    image.hidden = !this.image;
    if (this.image) image.src = this.image;
    this.query('.portrait').style.setProperty('--_hue', hueOf(this.name ?? ''));
    this.query('.initials').textContent = initialsOf(this.name ?? '');
    this.query('.name').textContent = this.name ?? '';
    this.query('.handle').textContent = this.handle ?? '';
    this.query('.role').textContent = this.role ?? '';
    this.query('.bio').textContent = this.bio ?? '';
    // The follower count rolls up as this viewer follows.
    roll(this.query('.followers'), full.format(this.followers + (this.followed ? 1 : 0)));
    this.query('.following-count').textContent = compact.format(this.following);
    this.query('.posts').textContent = compact.format(this.posts);
    this.query('.follow').following = Boolean(this.followed);
    const mutuals = this.mutuals ?? [];
    this.query('.faces').innerHTML = mutuals
      .slice(0, 3)
      .map((name) => `<span style="--_hue: ${hueOf(name)}">${escapeHtml(initialsOf(name))}</span>`)
      .join('');
    const others = Math.max(0, this.mutualCount - Math.min(2, mutuals.length));
    const named = mutuals.slice(0, 2).map((name) => name.split(' ')[0]);
    this.query('.mutuals').hidden = !mutuals.length;
    this.query('.mutual-text').textContent = `Followed by ${named.join(', ')}${others ? ` and ${others} other${others === 1 ? '' : 's'}` : ''}`;
  }
}
