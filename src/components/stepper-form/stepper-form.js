import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import '../password-input/index.js';
import '../text-input/index.js';
import '../textarea/index.js';
import styles from './stepper-form.scss?inline';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIZES = ['Just me', '2–10', '11–50', '51+'];

const slugOf = (text) => text.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32);

const STEPS = [
  {
    id: 'account',
    title: 'Account',
    lead: 'You will use this to sign in. No card required.',
    fields: `<div class="pair"><lw-text-input data-key="name" label="Full name" autocomplete="name" placeholder="Jordan Lee" required></lw-text-input><lw-text-input data-key="email" type="email" label="Work email" autocomplete="email" placeholder="jordan@company.com" required></lw-text-input></div>
<lw-password-input data-key="password" label="Password" placeholder="Choose a password" required></lw-password-input>`,
  },
  {
    id: 'workspace',
    title: 'Workspace',
    lead: 'Where your projects, builds and crash reports live.',
    fields: `<lw-text-input data-key="workspace" label="Workspace name" placeholder="Northwind" required></lw-text-input><p class="address"></p>
<div class="sizes-field"><span class="label" id="size-label">Team size</span><div class="sizes" role="radiogroup" aria-labelledby="size-label">${SIZES.map((size) => `<button class="size" type="button" role="radio" data-size="${size}">${size}</button>`).join('')}</div></div>`,
  },
  {
    id: 'invite',
    title: 'Invite your team',
    lead: 'They get an email with a link to join. You can do this later.',
    fields: '<lw-textarea data-key="invites" label="Email addresses" placeholder="ana@company.com, sam@company.com" rows="3"></lw-textarea><p class="invite-count"></p>',
  },
];

/**
 * Sign-up in three steps down one card: the account, the workspace and the
 * team. The open step checks its fields before it moves on, with Enter or
 * Continue; finished steps fold into a line saying what was entered, with
 * a way back to edit. The bar on top fills as you go.
 *
 * @attr {string} heading
 * @attr {string} domain - The workspace's address goes under it
 * @fires lw-complete - Every step is done; `detail: { name, email, workspace, slug, size, invites }`
 */
export class LwStepperForm extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    heading: { default: 'Set up your workspace' },
    domain: { default: 'lowersoft.dev' },
  };

  #step = 0;
  #size = SIZES[1];
  #done = false;

  render() {
    return `<header class="head"><h2 class="title"></h2><p class="progress-text" aria-live="polite"></p><div class="bar" aria-hidden="true">${STEPS.map(() => '<span class="segment"><span class="fill"></span></span>').join('')}</div></header>
<ol class="steps">${STEPS.map((step, i) => `<li class="step" data-index="${i}"><div class="step-head"><span class="marker"><span class="number">${i + 1}</span>${CHECK_ICON}</span><h3 class="step-title">${escapeHtml(step.title)}</h3><p class="summary"></p><button class="edit" type="button">Edit<span class="visually-hidden"> ${escapeHtml(step.title.toLowerCase())}</span></button></div>
<div class="panel"><div class="panel-inner"><p class="lead">${escapeHtml(step.lead)}</p><div class="fields">${step.fields}</div><div class="actions"><span class="enter"><kbd>Enter</kbd> to continue</span>${i === 2 ? '<lw-button class="skip" variant="ghost">Skip for now</lw-button>' : ''}<lw-button class="continue">${i === STEPS.length - 1 ? 'Finish' : 'Continue'}</lw-button></div></div></div></li>`).join('')}</ol>
<div class="done" role="status" hidden><span class="done-mark">${CHECK_ICON}</span><p class="done-title"></p><p class="done-text"></p></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const steps = this.query('.steps');
    steps.addEventListener('click', (event) => {
      if (event.target.closest('.continue')) return this.#next();
      if (event.target.closest('.skip')) {
        this.#field('invites').value = '';
        return this.#next();
      }
      const edit = event.target.closest('.edit');
      if (edit) this.#go(Number(edit.closest('.step').dataset.index), true);
      const size = event.target.closest('.size');
      if (size) {
        this.#size = size.dataset.size;
        this.#paintSizes();
      }
    }, options);
    steps.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.composedPath().some((node) => node.tagName === 'TEXTAREA' || node.tagName === 'BUTTON' || node.tagName === 'LW-BUTTON')) {
        event.preventDefault();
        this.#next();
      }
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (step && event.target.closest('.size')) {
        event.preventDefault();
        this.#size = SIZES[(SIZES.indexOf(this.#size) + step + SIZES.length) % SIZES.length];
        this.#paintSizes();
        this.query(`.size[data-size="${this.#size}"]`).focus();
      }
    }, options);
    steps.addEventListener('input', () => this.#paintLive(), options);
    this.#paintSizes();
  }

  updated() {
    this.query('.title').textContent = this.heading ?? '';
    this.#paint();
  }

  #field(key) {
    return this.query(`[data-key="${key}"]`);
  }

  #value(key) {
    return (this.#field(key)?.value ?? '').trim();
  }

  get #invites() {
    return this.#value('invites').split(/[\s,;]+/).filter(Boolean);
  }

  // The open step's fields, checked in order; the first bad one says why.
  #valid() {
    const fields = [...this.shadowRoot.querySelectorAll(`.step[data-index="${this.#step}"] [data-key]`)];
    const invites = this.#field('invites');
    if (STEPS[this.#step].id === 'invite') {
      const bad = this.#invites.find((email) => !EMAIL.test(email));
      invites.error = bad ? `“${bad}” is not an email address.` : '';
      if (bad) invites.focus();
      return !bad;
    }
    for (const field of fields) {
      if (!field.reportValidity()) {
        field.focus();
        return false;
      }
    }
    return true;
  }

  #next() {
    if (this.#done || !this.#valid()) return;
    if (this.#step === STEPS.length - 1) return this.#finish();
    this.#go(this.#step + 1, true);
  }

  #go(step, focus) {
    this.#step = step;
    this.#paint();
    if (focus) {
      const first = this.query(`.step[data-index="${step}"] [data-key]`);
      requestAnimationFrame(() => first?.focus());
    }
  }

  #paintSizes() {
    for (const size of this.shadowRoot.querySelectorAll('.size')) {
      const checked = size.dataset.size === this.#size;
      size.ariaChecked = String(checked);
      size.tabIndex = checked ? 0 : -1;
    }
  }

  // What follows the typing: the workspace address and the invite count.
  #paintLive() {
    const slug = slugOf(this.#value('workspace'));
    this.query('.address').innerHTML = `${escapeHtml(this.domain)}/<b>${escapeHtml(slug || 'your-team')}</b>`;
    const count = this.#invites.length;
    this.query('.invite-count').textContent = count ? `${count} ${count === 1 ? 'invite' : 'invites'} ready` : '';
  }

  #summaries() {
    const count = this.#invites.length;
    return [
      `${this.#value('name')} · ${this.#value('email')}`,
      `${this.#value('workspace')} · ${this.#size}`,
      count ? `${count} ${count === 1 ? 'invite' : 'invites'}` : 'Skipped',
    ];
  }

  #paint() {
    const summaries = this.#summaries();
    this.query('.progress-text').textContent = this.#done ? 'All set' : `Step ${this.#step + 1} of ${STEPS.length} · about ${STEPS.length - this.#step} min`;
    this.shadowRoot.querySelectorAll('.segment').forEach((segment, i) => {
      segment.toggleAttribute('data-done', this.#done || i < this.#step);
      segment.toggleAttribute('data-current', !this.#done && i === this.#step);
    });
    for (const step of this.shadowRoot.querySelectorAll('.step')) {
      const i = Number(step.dataset.index);
      const state = this.#done || i < this.#step ? 'done' : i === this.#step ? 'open' : 'next';
      step.dataset.state = state;
      step.querySelector('.panel').inert = state !== 'open';
      step.querySelector('.summary').textContent = state === 'done' ? summaries[i] : '';
      step.querySelector('.edit').hidden = state !== 'done' || this.#done;
      if (state === 'open') step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    }
    this.#paintLive();
  }

  #finish() {
    this.#done = true;
    this.#paint();
    const detail = { name: this.#value('name'), email: this.#value('email'), workspace: this.#value('workspace'), slug: slugOf(this.#value('workspace')), size: this.#size, invites: this.#invites };
    const done = this.query('.done');
    done.hidden = false;
    this.query('.done-title').textContent = `${detail.workspace} is ready`;
    this.query('.done-text').textContent = `It lives at ${this.domain}/${detail.slug}.${detail.invites.length ? ` We sent ${detail.invites.length} ${detail.invites.length === 1 ? 'invite' : 'invites'}.` : ''}`;
    if (!reducedMotion.matches) done.animate({ opacity: [0, 1], translate: ['0 0.5rem', '0 0'] }, { duration: 400, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    this.emit('complete', detail);
  }
}
