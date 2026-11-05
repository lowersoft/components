import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, check } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { billingToggle, formatMoney, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import '../button/index.js';
import styles from './cloud-pricing.scss?inline';

const DEMO_PLANS = [
  { id: 'free', name: 'Free', tagline: 'One notebook, all the basics.', monthly: 0, yearly: 0, action: 'Start free', features: ['1 notebook', 'Sync on 2 devices', 'Daily prompts'] },
  { id: 'plus', name: 'Plus', tagline: 'For people who write every day.', monthly: 6, yearly: 4, action: 'Get Plus', featured: true, badge: 'Most popular', features: ['Unlimited notebooks', 'Photo and voice entries', 'Sync on every device', 'Export to PDF'] },
  { id: 'family', name: 'Family', tagline: 'Up to five people, one bill.', monthly: 12, yearly: 9, action: 'Get Family', features: ['Everything in Plus', 'Up to 5 members', 'Shared notebooks'] },
];

// The sky is drawn at this share of its size and scaled up: clouds are soft,
// so nobody sees the difference, and it costs a third of the pixels.
const SCALE = 0.6;
const FRAME_MS = 1000 / 30;

// Sky and cloud colours by scheme: the day is deep blue with white clouds,
// the night navy with clouds lit grey by the moon.
const PALETTES = {
  light: { sky: ['#1f5fd6', '#3f82ec', '#8dbaf7'], light: '255 255 255', body: '236 242 252', shade: '186 204 232' },
  dark: { sky: ['#050b1f', '#0d1a3d', '#1c2c58'], light: '214 222 240', body: '138 150 178', shade: '64 76 108' },
};

// A seeded random, so the sky is the same on every visit.
const random = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// A soft disc: solid at its heart, fading out to its rim.
const blob = (context, x, y, r, color, alpha, solid = 0.45) => {
  const fill = context.createRadialGradient(x, y, 0, x, y, r);
  fill.addColorStop(0, `rgb(${color} / ${alpha})`);
  fill.addColorStop(solid, `rgb(${color} / ${alpha})`);
  fill.addColorStop(1, `rgb(${color} / 0)`);
  context.fillStyle = fill;
  context.fillRect(x - r, y - r, r * 2, r * 2);
};

// A cloud on a sprite, `height` tall and `width` wide: overlapping lobes
// make one soft silhouette with a flatter base, greyed towards the bottom,
// and each lobe catches the light on its upper right.
const drawCloud = (width, height, palette, rand, alpha) => {
  const sprite = new OffscreenCanvas(Math.max(1, Math.ceil(width)), Math.max(1, Math.ceil(height)));
  const context = sprite.getContext('2d');
  // Wide, low clouds need more lobes to stay one cloud.
  const count = Math.max(5, Math.round(width / (height * 0.32)));
  const lobes = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    // Taller in the middle, the cloud's crown.
    const crown = Math.sin(t * Math.PI) ** 0.8;
    const r = height * (0.12 + 0.2 * crown) * (0.85 + rand() * 0.3);
    const x = width * (0.08 + 0.84 * t) + (rand() - 0.5) * r * 0.5;
    const y = height * 0.92 - r * (0.55 + crown * 0.7) - rand() * r * 0.25;
    lobes.push({ x, y, r });
  }
  if ('filter' in context) context.filter = `blur(${Math.max(1, height * 0.02)}px)`;
  // The base: a long soft bar the lobes rise from.
  for (let i = 0; i < count; i++) blob(context, width * (0.12 + (0.76 * i) / Math.max(1, count - 1)), height * 0.8, height * 0.22, palette.body, alpha, 0.35);
  for (const { x, y, r } of lobes) blob(context, x, y, r, palette.body, alpha, 0.55);
  // Shade and light only where the cloud already is.
  context.globalCompositeOperation = 'source-atop';
  const base = context.createLinearGradient(0, height * 0.3, 0, height);
  base.addColorStop(0, `rgb(${palette.shade} / 0)`);
  base.addColorStop(1, `rgb(${palette.shade} / 0.85)`);
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);
  for (const { x, y, r } of lobes) blob(context, x + r * 0.28, y - r * 0.3, r * 0.75, palette.light, 0.9, 0.2);
  return sprite;
};

// Banks rise from the bottom corners, a few clouds float in between, and
// thin wisps cross the top. Each drifts at its own pace.
const buildSky = (width, height, palette) => {
  const rand = random(7);
  const clouds = [];
  // `stretch` draws a sprite wider than it was made: thin wisps.
  const add = (w, h, x, y, drift, sway, alpha = 1, wraps = false, stretch = 1) =>
    clouds.push({ sprite: drawCloud(w / stretch, h, palette, rand, alpha), w, h, x, y, drift, sway, phase: rand() * Math.PI * 2, wraps });
  const unit = Math.max(width, 640);
  // Wisps along the top, stretched thin and faint.
  for (let i = 0; i < 3; i++) add(unit * (0.28 + rand() * 0.14), unit * 0.05, rand() * width, height * (0.02 + rand() * 0.12), 5 + rand() * 4, 2, 0.32, true, 2.6);
  // Small clouds drifting through the middle.
  for (let i = 0; i < 3; i++) add(unit * (0.13 + rand() * 0.06), unit * 0.065, rand() * width, height * (0.3 + rand() * 0.25), 7 + rand() * 5, 4, 0.7, true);
  // The banks, the largest and the nearest, swaying in place.
  add(unit * 0.55, unit * 0.24, -unit * 0.14, height - unit * 0.17, 0, 18);
  add(unit * 0.6, unit * 0.26, width - unit * 0.44, height - unit * 0.18, 0, 22);
  add(unit * 0.34, unit * 0.13, width * 0.34, height - unit * 0.08, 0, 14, 0.95);
  return clouds;
};

/**
 * Plans on frosted glass over a drifting sky: cloud banks rise from the
 * corners and wisps cross the top, deep blue by day and navy by night. The
 * featured plan is brighter, badged and has the solid button. Monthly or
 * yearly rolls every price; each plan gives both prices, so a yearly plan
 * can be priced any way. The sky rests while off screen and stays still
 * for reduced motion.
 *
 * Plans are `{ id, name, tagline, monthly, yearly, action, features,
 * featured?, badge? }`, `yearly` being the price per month on a yearly plan.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {number} speed - How fast the clouds drift; 1 by default
 * @attr {Array<object>} plans (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-choose - A plan's action was chosen; `detail: { plan, billing, price }`
 * @csspart sky - The canvas the sky is drawn on
 * @csspart plan - Each plan's card
 */
export class LwCloudPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Simple plans for every journal' },
    description: { default: 'Write anywhere, keep everything. Switch plans or cancel whenever you like.' },
    billing: { default: 'monthly', reflect: true },
    speed: { type: Number, default: 1 },
    plans: { type: Object, default: DEMO_PLANS },
  };

  #context = null;
  #clouds = [];
  #size = { width: 0, height: 0 };
  #sky = PALETTES.light.sky;
  #visible = false;
  #frame = 0;
  #last = 0;
  #time = 0;

  render() {
    return `<section class="section" aria-labelledby="heading"><canvas class="sky" part="sky" aria-hidden="true"></canvas>
<div class="content"><header class="head"><h2 class="title" id="heading"></h2><p class="description"></p>${billingToggle()}</header><div class="plans"></div></div></section>`;
  }

  connected() {
    const canvas = this.query('.sky');
    this.#context = canvas.getContext('2d');
    wireBilling(this);
    this.query('.plans').addEventListener('click', (event) => {
      const action = event.target.closest('.action');
      if (!action) return;
      const plan = this.#plans.find((each) => each.id === action.dataset.id);
      this.emit('choose', { plan: plan.id, billing: this.billing, price: this.#price(plan) });
    }, { signal: this.signal });
    const resize = new ResizeObserver(() => this.#build());
    resize.observe(canvas);
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#start();
    }, this.signal);
    watchTheme(() => this.#build(), this.signal);
    reducedMotion.addEventListener('change', () => this.#start(), { signal: this.signal });
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    if (changed.has('plans')) this.#buildPlans();
    paintBilling(this);
    this.#paintPrices();
  }

  get #plans() {
    return Array.isArray(this.plans) ? this.plans : [];
  }

  #price(plan) {
    return this.billing === 'yearly' ? plan.yearly ?? plan.monthly : plan.monthly;
  }

  #buildPlans() {
    this.query('.plans').innerHTML = this.#plans
      .map((plan, i) => {
        const id = escapeHtml(plan.id);
        const badge = plan.featured && plan.badge ? `<span class="badge">${escapeHtml(plan.badge)}</span>` : '';
        const arrow = plan.featured ? `<span class="arrow" slot="end">${strokeIcon(arrowRight, 16)}</span>` : '';
        return `<article class="plan"${plan.featured ? ' data-featured' : ''} part="plan" data-id="${id}" style="--i: ${i}" aria-labelledby="plan-${id}">
<div class="plan-head"><h3 class="name" id="plan-${id}">${escapeHtml(plan.name)}</h3>${badge}</div><p class="tagline">${escapeHtml(plan.tagline ?? '')}</p>
<p class="price">${priceMarkup()}<span class="per">/ month</span></p><p class="billed"></p>
<lw-button class="action" data-id="${id}" variant="${plan.featured ? 'primary' : 'outline'}">${escapeHtml(plan.action ?? 'Choose')}${arrow}</lw-button>
<ul class="features">${(plan.features ?? []).map((feature) => `<li>${strokeIcon(check, 15)}<span>${escapeHtml(feature)}</span></li>`).join('')}</ul></article>`;
      })
      .join('');
  }

  #paintPrices() {
    const yearly = this.billing === 'yearly';
    for (const card of this.shadowRoot.querySelectorAll('.plan')) {
      const plan = this.#plans.find((each) => each.id === card.dataset.id);
      const price = this.#price(plan);
      paintPrice(card.querySelector('.amount'), price);
      card.querySelector('.billed').textContent = !price ? 'Free forever' : yearly ? `Billed yearly · ${formatMoney(price * 12)} a year` : 'Billed monthly';
    }
  }

  // Lays the clouds out for the canvas's size and the scheme in use.
  #build() {
    const canvas = this.query('.sky');
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height || !this.#context) return;
    canvas.width = Math.round(width * SCALE);
    canvas.height = Math.round(height * SCALE);
    this.#context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    this.#size = { width, height };
    const palette = PALETTES[getComputedStyle(this).colorScheme.includes('dark') ? 'dark' : 'light'];
    this.#sky = palette.sky;
    this.#clouds = buildSky(width, height, palette);
    this.#draw();
    this.#start();
  }

  get #moving() {
    return this.#visible && !reducedMotion.matches && this.speed > 0;
  }

  #start() {
    if (this.#frame || !this.#moving) return;
    this.#last = 0;
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  // Thirty frames a second is plenty for clouds.
  #tick(now) {
    this.#frame = 0;
    if (!this.#moving) return;
    if (!this.#last || now - this.#last >= FRAME_MS) {
      this.#time += (this.#last ? Math.min(now - this.#last, 100) / 1000 : 0) * this.speed;
      this.#last = now;
      this.#draw();
    }
    this.#frame = requestAnimationFrame((next) => this.#tick(next));
  }

  #draw() {
    const context = this.#context;
    const { width, height } = this.#size;
    if (!context || !width) return;
    const sky = context.createLinearGradient(0, 0, 0, height);
    this.#sky.forEach((color, i) => sky.addColorStop(i / (this.#sky.length - 1), color));
    context.fillStyle = sky;
    context.fillRect(0, 0, width, height);
    const t = this.#time;
    for (const cloud of this.#clouds) {
      let x = cloud.x + cloud.drift * t + Math.sin(t * 0.12 + cloud.phase) * cloud.sway;
      // Wisps and small clouds leave on the right and come back on the left.
      if (cloud.wraps) x = ((((x + cloud.w) % (width + cloud.w)) + width + cloud.w) % (width + cloud.w)) - cloud.w;
      const y = cloud.y + Math.cos(t * 0.09 + cloud.phase) * cloud.sway * 0.25;
      context.drawImage(cloud.sprite, x, y, cloud.w, cloud.h);
    }
  }
}
