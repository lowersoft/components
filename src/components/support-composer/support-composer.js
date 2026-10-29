import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { arrowUp, arrowUpRight, fileText, paperclip, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { IS_APPLE } from '../../core/platform.js';
import { swapStyles } from '../../core/swap.js';
import { drawFace } from '../../core/testimonial.js';
import styles from './support-composer.scss?inline';

const TOPICS = [
  { value: 'bug', label: 'Bug' },
  { value: 'build', label: 'Build or toolchain' },
  { value: 'billing', label: 'Billing' },
  { value: 'question', label: 'Question' },
];

const DEMO_ARTICLES = [
  { title: 'Read a crash report', minutes: 2, href: '#' },
  { title: 'Symbolicate a stack trace', minutes: 3, href: '#' },
  { title: 'Cross-compile for ARM', minutes: 4, href: '#' },
  { title: 'Download invoices', minutes: 1, href: '#' },
  { title: 'Invite teammates to a workspace', minutes: 2, href: '#' },
];

const DEMO_TEAM = ['Ana Moreno', 'Jules Laurent', 'Sam Okafor'];
const SHOWN_ARTICLES = 3;

const wordsOf = (text) => text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];

/**
 * A support message box that tries to help before it sends. As the subject
 * is typed, the articles that match it rise to the top; screenshots can be
 * attached, pasted or dropped; the topic is picked from a menu, and
 * Ctrl+Enter (⌘+Enter on Apple) sends. Sending waits on `send` if set,
 * then says where the reply will come.
 *
 * Articles are `{ title, minutes, href }`.
 *
 * Set the `send` property to an async function taking `{ subject,
 * message, topic, files }`; a rejection keeps the message.
 *
 * @attr {Array<string>} team - Who replies (JSON)
 * @attr {string} reply - How soon
 * @attr {string} status - The service status line
 * @attr {string} status-href
 * @attr {string} topic
 * @attr {Array<object>} articles (JSON)
 * @fires lw-send - A message was sent; `detail: { subject, message, topic, files }`
 */
export class LwSupportComposer extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    team: { type: Object, default: DEMO_TEAM },
    reply: { default: 'Usually replies in 2h' },
    status: { default: 'All systems normal' },
    statusHref: { default: '#' },
    topic: { default: 'bug' },
    articles: { type: Object, default: DEMO_ARTICLES },
  };

  #files = [];
  #topicPicker;

  render() {
    const key = IS_APPLE ? '⌘' : 'Ctrl';
    return `<header class="head"><span class="faces"></span><p class="who"><b>Support</b> · <span class="reply"></span></p><a class="status"><span class="dot"></span><span class="status-text"></span>${strokeIcon(arrowUpRight, 13)}</a></header>
<form class="box" novalidate><input class="subject" type="text" placeholder="Subject" aria-label="Subject" autocomplete="off"><textarea class="message" rows="3" placeholder="What happened, and what did you expect instead?" aria-label="Message"></textarea>
<ul class="files"></ul><div class="tools">${pickerMarkup('topic-menu', { label: 'Topic' })}<label class="attach">${strokeIcon(paperclip, 16)}<span>Attach</span><input class="file" type="file" accept="image/*,.txt,.log" multiple></label><button class="send" type="submit" aria-label="Send" disabled>${strokeIcon(arrowUp, 18)}</button></div></form>
<section class="articles" aria-labelledby="articles-title"><header class="articles-head"><h3 class="articles-title" id="articles-title"></h3><button class="hide" type="button" aria-label="Hide articles">${strokeIcon(x, 15)}</button></header><ul class="article-list"></ul></section>
<p class="hint">${key}+↵ to send · Paste or drop screenshots</p><p class="sent" role="status" hidden></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#topicPicker = createPicker(this.query('.picker'), this.signal, (value) => (this.topic = value));
    const box = this.query('.box');
    box.addEventListener('input', () => this.#paint(), options);
    box.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#send();
    }, options);
    box.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (IS_APPLE ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();
        this.#send();
      }
    }, options);
    this.query('.file').addEventListener('change', (event) => {
      this.#attach([...event.target.files]);
      event.target.value = '';
    }, options);
    box.addEventListener('paste', (event) => {
      const files = [...(event.clipboardData?.files ?? [])];
      if (files.length) {
        event.preventDefault();
        this.#attach(files);
      }
    }, options);
    box.addEventListener('dragover', (event) => {
      event.preventDefault();
      box.toggleAttribute('data-drop', true);
    }, options);
    box.addEventListener('dragleave', () => box.removeAttribute('data-drop'), options);
    box.addEventListener('drop', (event) => {
      event.preventDefault();
      box.removeAttribute('data-drop');
      this.#attach([...(event.dataTransfer?.files ?? [])]);
    }, options);
    this.query('.files').addEventListener('click', (event) => {
      const remove = event.target.closest('.remove');
      if (!remove) return;
      this.#files.splice(Number(remove.dataset.index), 1);
      this.#paintFiles();
    }, options);
    this.query('.hide').addEventListener('click', () => (this.query('.articles').hidden = true), options);
  }

  updated(changed) {
    if (changed.has('team')) {
      const faces = this.query('.faces');
      faces.replaceChildren();
      for (const name of this.team ?? []) {
        const face = Object.assign(document.createElement('span'), { className: 'face' });
        drawFace(face, name);
        faces.append(face);
      }
    }
    this.query('.reply').textContent = this.reply ?? '';
    this.query('.status-text').textContent = this.status ?? '';
    this.query('.status').href = this.statusHref ?? '#';
    this.#topicPicker?.set(TOPICS, this.topic);
    this.#paint();
  }

  // The send button, and the articles ranked by how well they match the subject.
  #paint() {
    const subject = this.query('.subject').value.trim();
    const message = this.query('.message').value.trim();
    this.query('.send').disabled = !subject || !message;
    const words = wordsOf(subject);
    const scored = (this.articles ?? []).map((article) => ({ article, score: wordsOf(article.title).filter((word) => words.some((typed) => word.startsWith(typed) || typed.startsWith(word))).length }));
    const matching = scored.filter((each) => each.score).sort((a, b) => b.score - a.score);
    const shown = (matching.length ? matching : scored).slice(0, SHOWN_ARTICLES).map((each) => each.article);
    this.query('.articles-title').textContent = matching.length ? 'These might help' : 'Popular articles';
    this.query('.article-list').innerHTML = shown
      .map((article) => `<li><a class="article" href="${escapeHtml(article.href ?? '#')}">${strokeIcon(fileText, 15)}<span class="article-title">${escapeHtml(article.title)}</span><span class="article-time">${article.minutes} min</span></a></li>`)
      .join('');
  }

  #attach(files) {
    this.#files.push(...files.filter((file) => file.size));
    this.#paintFiles();
  }

  #paintFiles() {
    this.query('.files').innerHTML = this.#files
      .map((file, i) => `<li class="attached"><span class="file-name">${escapeHtml(file.name || 'Pasted image')}</span><button class="remove" type="button" data-index="${i}" aria-label="Remove ${escapeHtml(file.name || 'pasted image')}">${strokeIcon(x, 13)}</button></li>`)
      .join('');
  }

  async #send() {
    const subject = this.query('.subject').value.trim();
    const message = this.query('.message').value.trim();
    if (!subject || !message) return;
    const detail = { subject, message, topic: this.topic, files: [...this.#files] };
    const send = this.query('.send');
    send.disabled = true;
    send.setAttribute('aria-busy', 'true');
    try {
      await this.send?.(detail);
    } catch {
      send.disabled = false;
      return;
    } finally {
      send.removeAttribute('aria-busy');
    }
    this.query('.box').reset();
    this.#files = [];
    this.#paintFiles();
    this.#paint();
    const sent = this.query('.sent');
    sent.hidden = false;
    sent.textContent = `Sent “${subject}”. We'll reply by email; ${this.reply?.toLowerCase() ?? ''}.`;
    this.emit('send', detail);
  }
}
