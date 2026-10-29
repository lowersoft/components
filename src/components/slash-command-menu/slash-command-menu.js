import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { arrowUp, clock, messageSquareText, squareTerminal, user } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import styles from './slash-command-menu.scss?inline';

const POLL = '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9M13 17V5M8 17v-3"/>';

// Each command: what to type after it, and what it posts.
const COMMANDS = [
  { name: 'assign', icon: user, hint: '@person', about: 'Hand the thread to someone', post: (args) => `assigned this to ${args || 'nobody yet'}` },
  { name: 'remind', icon: clock, hint: 'what, when', about: 'Remind the channel later', post: (args) => `set a reminder: “${args || 'check back'}”` },
  { name: 'poll', icon: POLL, hint: 'question', about: 'Ask the channel to vote', post: (args) => `started a poll: “${args || 'Yes or no?'}”` },
  { name: 'build', icon: squareTerminal, hint: 'branch', about: 'Start a build and post the result', post: (args) => `started a build of ${args || 'main'}` },
  { name: 'shrug', icon: messageSquareText, hint: 'message', about: 'Append ¯\\_(ツ)_/¯', post: (args) => `${args} ¯\\_(ツ)_/¯`.trim(), plain: true },
];

const DEMO_MESSAGES = [
  { who: 'Maya Chen', time: '9:41', text: 'New flame graph colours are up for review. Labels still need a pass.' },
  { who: 'Leo Martins', time: '9:44', text: 'Looks great. Who is taking the labels?' },
  { who: 'Ana Silva', time: '9:52', text: 'Not me this week, I am on call. Remind Maya?' },
];

const clockNow = () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }).format(new Date());

/**
 * A channel with slash commands. Type `/` at the start of a message and
 * the commands open above the box, narrowing as you type; the arrow keys
 * move, Tab or Enter takes one and leaves room for its argument, Escape
 * closes. Enter sends: a command posts what it did, a message posts as is.
 *
 * Messages are `{ who, time, text }`.
 *
 * @attr {string} channel
 * @attr {number} members
 * @attr {string} you - Your name on what you post
 * @attr {Array<object>} messages (JSON)
 * @fires lw-send - A message or command was sent; `detail: { text, command, args }`
 */
export class LwSlashCommandMenu extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    channel: { default: 'runtime' },
    members: { type: Number, default: 4 },
    you: { default: 'Sam Okafor' },
    messages: { type: Object, default: DEMO_MESSAGES },
  };

  #active = 0;
  #shown = [];

  render() {
    return `<header class="head">${strokeIcon(messageSquareText, 20)}<h2 class="channel"></h2><span class="members"></span></header>
<div class="log" role="log" aria-live="polite"></div>
<form class="composer"><div class="menu" id="commands" role="listbox" aria-label="Commands" hidden><span class="highlight"></span><div class="commands"></div></div><input class="input" type="text" role="combobox" aria-controls="commands" aria-expanded="false" aria-autocomplete="list" autocomplete="off" spellcheck="false"><button class="send" type="submit" aria-label="Send" disabled>${strokeIcon(arrowUp, 16)}</button></form>`;
  }

  connected() {
    const options = { signal: this.signal };
    const input = this.query('.input');
    input.addEventListener('input', () => {
      this.#active = 0;
      this.#paintMenu();
    }, options);
    input.addEventListener('keydown', (event) => this.#key(event), options);
    input.addEventListener('blur', () => setTimeout(() => this.#close(), 120), options);
    this.query('.composer').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#send();
    }, options);
    this.query('.commands').addEventListener('pointerdown', (event) => {
      const option = event.target.closest('.command');
      if (!option) return;
      event.preventDefault();
      this.#take(Number(option.dataset.index));
    }, options);
  }

  updated(changed) {
    this.query('.channel').textContent = `#${this.channel}`;
    this.query('.members').textContent = `${this.members} members`;
    this.query('.input').placeholder = `Message #${this.channel}, or type / for commands`;
    if (changed.has('messages')) {
      this.query('.log').replaceChildren();
      for (const message of this.messages) this.#append(message, false);
    }
  }

  #append(message, scroll = true) {
    const log = this.query('.log');
    log.insertAdjacentHTML('beforeend', `<article class="message${message.action ? ' action' : ''}"><span class="avatar" style="--_hue: ${hueOf(message.who)}">${escapeHtml(initialsOf(message.who))}</span><div><p class="meta"><b>${escapeHtml(message.who)}</b><time>${escapeHtml(message.time)}</time></p><p class="text">${escapeHtml(message.text)}</p></div></article>`);
    if (scroll) log.lastElementChild.scrollIntoView({ block: 'nearest' });
  }

  // `/name args` split, when the message is a command.
  get #command() {
    const match = this.query('.input').value.match(/^\/(\w*)(?:\s+(.*))?$/s);
    return match ? { name: match[1].toLowerCase(), args: (match[2] ?? '').trim(), complete: /\s/.test(this.query('.input').value) } : null;
  }

  #paintMenu() {
    const command = this.#command;
    const input = this.query('.input');
    this.query('.send').disabled = !input.value.trim();
    this.#shown = command && !command.complete ? COMMANDS.filter((each) => each.name.startsWith(command.name)) : [];
    const menu = this.query('.menu');
    menu.hidden = !this.#shown.length;
    input.ariaExpanded = String(!menu.hidden);
    this.query('.commands').innerHTML = this.#shown
      .map((each, i) => `<div class="command" role="option" id="command-${i}" data-index="${i}">${strokeIcon(each.icon, 16)}<span class="command-name">/${each.name}</span><span class="command-hint">${escapeHtml(each.hint)}</span><span class="command-about">${escapeHtml(each.about)}</span></div>`)
      .join('');
    this.#paintActive();
  }

  #paintActive() {
    const options = [...this.shadowRoot.querySelectorAll('.command')];
    this.#active = Math.min(this.#active, Math.max(0, options.length - 1));
    options.forEach((option, i) => option.ariaSelected = String(i === this.#active));
    const active = options[this.#active];
    const input = this.query('.input');
    if (active) {
      moveHighlight(this.query('.highlight'), active);
      input.setAttribute('aria-activedescendant', active.id);
    } else {
      hideHighlight(this.query('.highlight'));
      input.removeAttribute('aria-activedescendant');
    }
  }

  #close() {
    this.#shown = [];
    this.query('.menu').hidden = true;
    this.query('.input').ariaExpanded = 'false';
  }

  // Fills in the command, leaving room for what follows it.
  #take(index) {
    const command = this.#shown[index];
    if (!command) return;
    const input = this.query('.input');
    input.value = `/${command.name} `;
    input.focus();
    this.#close();
    this.query('.send').disabled = false;
  }

  #key(event) {
    const open = this.#shown.length > 0;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (open && step) {
      event.preventDefault();
      this.#active = (this.#active + step + this.#shown.length) % this.#shown.length;
      this.#paintActive();
    } else if (open && (event.key === 'Tab' || event.key === 'Enter')) {
      event.preventDefault();
      this.#take(this.#active);
    } else if (open && event.key === 'Escape') {
      event.preventDefault();
      this.#close();
    }
  }

  #send() {
    const input = this.query('.input');
    const text = input.value.trim();
    if (!text) return;
    const typed = this.#command;
    const command = typed && COMMANDS.find((each) => each.name === typed.name);
    if (command) {
      this.#append({ who: this.you, time: clockNow(), text: command.post(typed.args), action: !command.plain });
    } else {
      this.#append({ who: this.you, time: clockNow(), text });
    }
    this.emit('send', { text, command: command?.name, args: typed?.args });
    input.value = '';
    this.#paintMenu();
  }
}
