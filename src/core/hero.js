import { escapeHtml } from './dom.js';
import { strokeIcon } from './icons.js';
import { arrowRight } from './lucide.js';

// Shared markup for the hero components. They import `../button/index.js`
// themselves and style it with the `hero-split` and `hero-actions` mixins.

/** The default actions: a primary pill with an arrow, and a quiet second one if given. */
export const heroActions = (primary, secondary) =>
  `<div class="actions"><slot name="actions"><lw-button class="primary">${escapeHtml(primary)}<span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button>${secondary ? `<lw-button class="secondary" variant="ghost">${escapeHtml(secondary)}</lw-button>` : ''}</slot></div>`;

/** The split intro: the headline beside the description and the actions. */
export const heroIntro = (primary, secondary) =>
  `<div class="intro"><div class="lead"><slot name="eyebrow"></slot><h1 class="title"></h1></div><div class="pitch"><p class="description"></p>${heroActions(primary, secondary)}</div></div>`;

/** A centred hero's two large pill actions, inside its `actions` slot; style them with `hero-pill-actions`. */
export const heroPillActions = () =>
  `<slot name="actions"><lw-button class="primary" size="lg"><span class="primary-label"></span><span class="arrow" slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><lw-button class="secondary" size="lg" variant="outline"></lw-button></slot>`;

/** Writes a hero's `primary` and `secondary` labels into its pill actions; no second action without one. */
export const paintPillActions = (hero) => {
  hero.query('.primary-label').textContent = hero.primary ?? '';
  const secondary = hero.query('.secondary');
  secondary.textContent = hero.secondary ?? '';
  secondary.hidden = !hero.secondary;
};

/** Writes a hero's `heading` and `description` into its `.title` and `.description`. */
export const paintHeroText = (hero) => {
  hero.query('.title').textContent = hero.heading ?? '';
  hero.query('.description').textContent = hero.description ?? '';
};
