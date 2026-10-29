import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './file-upload.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';
import { countDraggedFiles, describeTypes, extensionOf, formatBytes, isFileDrag, matchesType, simulateUpload } from './files.js';

const CONCURRENCY = 3;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const svg = (paths, className = '') =>
  `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const UPLOAD_ICON = svg('<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>', 'upload');
const RETRY_ICON = svg('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>');
const CLOSE_ICON = svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>');

const ROW = document.createElement('template');
ROW.innerHTML = `<li class="row"><div class="row-body"><span class="thumb" aria-hidden="true"></span><span class="info"><span class="name"></span><span class="meta"><span class="size"></span><span class="dot" aria-hidden="true">·</span><span class="status"></span></span></span><span class="actions"><span class="done">${CHECK_ICON}</span><button class="action retry" type="button">${RETRY_ICON}Retry</button><button class="action remove" type="button">${CLOSE_ICON}</button></span><span class="track"><span class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></span></span></div></li>`;

const STATUS_TEXT = { queued: () => 'Waiting', uploading: (item) => `${Math.round(item.progress)}%`, done: () => 'Uploaded' };

/** Grows an element in from nothing. */
const expand = (element) => {
  if (reducedMotion.matches) return;
  element.animate({ height: ['0px', `${element.scrollHeight}px`] }, { duration: 350, easing: EASE_OUT });
  element.animate({ opacity: [0, 1] }, { duration: 200, delay: 50, easing: EASE_OUT, fill: 'backwards' });
};

/** Shrinks an element away, then runs `done`. */
const collapse = (element, done) => {
  if (reducedMotion.matches) {
    done();
    return;
  }
  element.animate({ opacity: [1, 0] }, { duration: 120, easing: EASE_OUT, fill: 'forwards' });
  const shrink = element.animate({ height: [`${element.offsetHeight}px`, '0px'] }, { duration: 200, easing: EASE_OUT, fill: 'forwards' });
  shrink.onfinish = done;
  shrink.oncancel = done;
};

/**
 * A drop zone with an upload queue. Drop, paste or browse for files; each is
 * checked against `accept`, `max-size` and `validateFile`, then uploaded a
 * few at a time with a progress line, a retry on failure and a remove or
 * cancel button. A file dragged anywhere over the window wakes the zone.
 *
 * Set `upload` to a function that uploads one file: `async (file, { onProgress,
 * signal }) => {}`. Report progress from 0 to 100, resolve when done, reject
 * to show the error, and stop when `signal` aborts. Without it, uploads are
 * simulated over `upload-delay`. With a `name`, uploaded files are submitted
 * with the form.
 *
 * @attr {string} accept - MIME types, wildcards or extensions, as on a file input
 * @attr {boolean} multiple - Accept several files
 * @attr {number} max-files - The most files the list holds with `multiple`
 * @attr {number} max-size - The largest file in bytes
 * @attr {string} name - Submits the uploaded files with the form under this name
 * @attr {number} upload-delay - Milliseconds a simulated upload takes
 * @attr {boolean} simulate-failure - Simulated uploads only: the first try of every third file fails
 * @fires lw-upload-success - `detail: { file }`
 * @fires lw-upload-error - A file was rejected or its upload failed; `detail: { error: { message, code }, file }`
 * @fires lw-remove - A file was removed, cancelling its upload; `detail: { file }`
 * @fires lw-complete - Nothing is queued or uploading any more; `detail: { files }`, the uploaded files
 * @csspart base
 * @csspart zone - The drop zone button
 * @csspart list - The file list
 */
export class LwFileUpload extends FormControl(LwElement) {
  static styles = [iconStyles, styles];
  static props = {
    accept: {},
    multiple: { type: Boolean },
    maxFiles: { type: Number, default: 5 },
    maxSize: { type: Number, default: 5 * 1024 * 1024 },
    name: {},
    uploadDelay: { type: Number, default: 2000 },
    simulateFailure: { type: Boolean },
  };

  // `upload` is set as a property: uploads one file: `async (file, { onProgress, signal }) => {}`.
  // Not declared as a field, which would overwrite a value set before upgrade.
  // `validateFile` is set as a property: extra check per file: return `{ message, code }` to reject it, or null.
  // Not declared as a field, which would overwrite a value set before upgrade.

  #items = [];
  #busy = false;
  #windowDrag = false;
  #overZone = 0;
  #nextIndex = 0;

  render() {
    return `<div class="card" part="base"><button class="zone" part="zone" type="button" aria-describedby="hint"><span class="zone-icon">${UPLOAD_ICON}</span><span class="copy"><span class="title"></span><span class="hint" id="hint"></span></span></button><input class="input" type="file" tabindex="-1" hidden><p class="notice" role="alert" hidden></p><ul class="list" part="list" aria-label="Files"></ul><div class="footer" hidden><div class="footer-body"><output class="summary" aria-live="polite"></output><button class="clear" type="button"></button></div></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const zone = this.query('.zone');
    const input = this.query('.input');
    zone.addEventListener('click', () => !this.#full && input.click(), options);
    zone.addEventListener('paste', (event) => this.#paste(event), options);
    zone.addEventListener('dragenter', (event) => this.#dragOverZone(event), options);
    zone.addEventListener('dragover', (event) => this.#dragOverZone(event), options);
    zone.addEventListener('dragleave', (event) => !zone.contains(event.relatedTarget) && this.#setDrag({ over: 0 }), options);
    zone.addEventListener('drop', (event) => this.#drop(event), options);
    input.addEventListener(
      'change',
      () => {
        this.addFiles(input.files);
        input.value = '';
      },
      options,
    );
    this.query('.list').addEventListener('click', (event) => this.#rowAction(event), options);
    this.query('.clear').addEventListener('click', () => this.clear(), options);
    this.#watchWindowDrag(options);
    this.signal.addEventListener('abort', () => this.#suspend());
    this.#pump();
  }

  updated(changed) {
    const input = this.query('.input');
    input.accept = this.#types.join(',');
    input.multiple = this.multiple;
    if (changed.has('name')) this.#syncForm();
    this.#syncZone();
  }

  /** The files uploaded so far. */
  get files() {
    return this.#items.filter((item) => item.status === 'done').map((item) => item.file);
  }

  /** Adds files as if they were dropped. */
  addFiles(fileList) {
    const files = [...(fileList ?? [])];
    if (files.length === 0) return;
    let room = Math.max(0, this.#limit - this.#counted);
    let skipped = 0;
    const list = this.query('.list');
    for (const file of files) {
      const error = this.#validate(file);
      if (!error && room === 0) {
        skipped += 1;
        continue;
      }
      if (!error) room -= 1;
      const item = { index: this.#nextIndex++, file, status: error ? 'rejected' : 'queued', progress: 0, attempts: 0, error };
      if (!error && file.type.startsWith('image/')) item.previewUrl = URL.createObjectURL(file);
      item.row = this.#createRow(item);
      this.#items.push(item);
      list.append(item.row);
      expand(item.row);
      if (error) this.emit('upload-error', { error, file });
    }
    this.#notice(skipped ? `${skipped} ${skipped === 1 ? 'file was' : 'files were'} not added. The limit is ${this.#limit}.` : '');
    this.#pump();
  }

  /** Removes every file, cancelling uploads in flight. */
  clear() {
    [...this.#items].forEach((item) => this.#remove(item));
  }

  formResetCallback() {
    this.clear();
  }

  get #types() {
    return (this.accept ?? '')
      .split(',')
      .map((type) => type.trim())
      .filter(Boolean);
  }

  get #limit() {
    return this.multiple ? Math.max(1, this.maxFiles) : 1;
  }

  get #counted() {
    return this.#items.filter((item) => item.status !== 'rejected').length;
  }

  get #full() {
    return this.#counted >= this.#limit;
  }

  #validate(file) {
    const types = this.#types;
    if (types.length && !types.some((type) => matchesType(file, type))) return { message: `Not ${describeTypes(types)}`, code: 'INVALID_FILE_TYPE' };
    if (file.size > this.maxSize) return { message: `Larger than ${formatBytes(this.maxSize)}`, code: 'FILE_TOO_LARGE' };
    return this.validateFile?.(file) ?? null;
  }

  // Keeps up to CONCURRENCY uploads in flight.
  #pump() {
    if (!this.isConnected) return;
    const active = this.#items.filter((item) => item.status === 'uploading').length;
    this.#items
      .filter((item) => item.status === 'queued')
      .slice(0, Math.max(0, CONCURRENCY - active))
      .forEach((item) => this.#run(item));
    this.#settle();
  }

  #run(item) {
    const controller = new AbortController();
    const { signal } = controller;
    Object.assign(item, { controller, status: 'uploading', progress: 0, error: null, attempts: item.attempts + 1 });
    this.#paint(item);
    const onProgress = (percent) => {
      if (signal.aborted) return;
      item.progress = Math.min(Math.max(percent, 0), 100);
      this.#paint(item);
    };
    const finish = (patch) => {
      if (signal.aborted) return;
      Object.assign(item, { controller: null }, patch);
      this.#paint(item);
      if (patch.status === 'done') this.emit('upload-success', { file: item.file });
      else this.emit('upload-error', { error: item.error, file: item.file });
      this.#pump();
    };
    const upload = this.upload
      ? Promise.resolve().then(() => this.upload(item.file, { onProgress, signal }))
      : simulateUpload({ onProgress, signal }, this.uploadDelay, this.simulateFailure && item.attempts === 1 && item.index % 3 === 1);
    upload.then(
      () => finish({ status: 'done', progress: 100 }),
      (reason) => finish({ status: 'error', error: { message: (reason instanceof Error && reason.message) || 'Upload failed', code: 'UPLOAD_FAILED' } }),
    );
  }

  #remove(item) {
    item.controller?.abort();
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    this.#items = this.#items.filter((other) => other !== item);
    item.row.inert = true;
    collapse(item.row, () => item.row.remove());
    this.#notice('');
    this.emit('remove', { file: item.file });
    this.#pump();
  }

  // Disconnected: stop the uploads, to start over if it comes back.
  #suspend() {
    for (const item of this.#items) {
      if (item.status !== 'uploading') continue;
      item.controller.abort();
      Object.assign(item, { controller: null, status: 'queued', attempts: item.attempts - 1, progress: 0 });
      this.#paint(item);
    }
  }

  // Updates the zone, the summary and the form, and reports once nothing is
  // queued or in flight.
  #settle() {
    let done = 0;
    let failed = 0;
    let busy = false;
    for (const { status } of this.#items) {
      if (status === 'done') done += 1;
      else if (status === 'error' || status === 'rejected') failed += 1;
      else busy = true;
    }
    if (this.#busy && !busy) this.emit('complete', { files: this.files });
    this.#busy = busy;

    const count = Object.assign(document.createElement('span'), { className: 'count', textContent: done });
    const parts = [count, ` of ${this.#items.length} uploaded`];
    if (failed) parts.push(Object.assign(document.createElement('span'), { className: 'failed', textContent: ` · ${failed} failed` }));
    this.query('.summary').replaceChildren(...parts);
    this.query('.clear').textContent = busy ? 'Cancel all' : 'Clear';
    this.#toggleFooter(this.#items.length > 0);
    this.#syncZone();
    this.#syncForm();
  }

  #toggleFooter(show) {
    const footer = this.query('.footer');
    if (show === !footer.hidden && !footer.dataset.leaving) return;
    footer.getAnimations().forEach((animation) => animation.cancel());
    if (show) {
      delete footer.dataset.leaving;
      footer.hidden = false;
      expand(footer);
    } else {
      footer.dataset.leaving = '';
      collapse(footer, () => {
        if (footer.dataset.leaving === undefined) return;
        delete footer.dataset.leaving;
        footer.hidden = true;
      });
    }
  }

  #syncForm() {
    if (!this.name) {
      this[INTERNALS].setFormValue(null);
      return;
    }
    const data = new FormData();
    this.files.forEach((file) => data.append(this.name, file));
    this[INTERNALS].setFormValue(data);
  }

  #syncZone() {
    const zone = this.query('.zone');
    const full = this.#full;
    const noun = this.multiple ? 'files' : 'a file';
    const size = this.maxSize > 0 && Number.isFinite(this.maxSize) ? ` up to ${formatBytes(this.maxSize)}` : '';
    let title = `Drop ${noun} here or `;
    let hint = `${describeTypes(this.#types)}${size}${this.multiple ? ` · ${this.#limit} max` : ''}`;
    if (full) {
      title = 'File limit reached';
      hint = 'Remove a file to add another';
    } else if (this.#overZone) {
      title = `Release to add ${this.#overZone} ${this.#overZone === 1 ? 'file' : 'files'}`;
    } else if (this.#windowDrag) {
      title = `Drop ${noun} here`;
    }
    const browse = !full && !this.#overZone && !this.#windowDrag;
    this.query('.title').replaceChildren(title, ...(browse ? [Object.assign(document.createElement('span'), { className: 'browse', textContent: 'browse' })] : []));
    this.query('.hint').textContent = hint;
    zone.ariaDisabled = full ? 'true' : null;
    zone.toggleAttribute('data-armed', this.#windowDrag && !full);
    zone.toggleAttribute('data-over', this.#overZone > 0 && !full);
  }

  #notice(text) {
    const notice = this.query('.notice');
    notice.textContent = text;
    notice.hidden = !text;
  }

  #createRow(item) {
    const row = ROW.content.firstElementChild.cloneNode(true);
    const { name, size } = item.file;
    row.querySelector('.name').textContent = name;
    row.querySelector('.size').textContent = formatBytes(size);
    row.querySelector('.retry').ariaLabel = `Retry ${name}`;
    row.querySelector('.bar').ariaLabel = `Uploading ${name}`;
    const thumb = row.querySelector('.thumb');
    if (item.previewUrl) thumb.style.backgroundImage = `url("${item.previewUrl}")`;
    else thumb.textContent = extensionOf(name);
    thumb.toggleAttribute('data-image', Boolean(item.previewUrl));
    this.#paint(item, row);
    return row;
  }

  #paint(item, row = item.row) {
    const { status, progress } = item;
    const inFlight = status === 'queued' || status === 'uploading';
    row.dataset.status = status;
    row.querySelector('.status').textContent = STATUS_TEXT[status]?.(item) ?? item.error?.message ?? 'Upload failed';
    row.querySelector('.remove').ariaLabel = `${inFlight ? 'Cancel' : 'Remove'} ${item.file.name}`;
    const bar = row.querySelector('.bar');
    // A retry starts from zero at once instead of rewinding.
    bar.toggleAttribute('data-instant', progress === 0);
    bar.style.transform = `scaleX(${progress / 100})`;
    bar.ariaValueNow = String(Math.round(progress));
  }

  #rowAction(event) {
    const button = event.target.closest('.action');
    const item = button && this.#items.find(({ row }) => row.contains(button));
    if (!item) return;
    if (button.classList.contains('remove')) {
      this.#remove(item);
      // Keep focus in the list rather than losing it with the row.
      this.query('.zone').focus();
      return;
    }
    item.status = 'queued';
    item.progress = 0;
    this.#paint(item);
    this.#pump();
  }

  #setDrag({ windowDrag = this.#windowDrag, over = this.#overZone }) {
    if (windowDrag === this.#windowDrag && over === this.#overZone) return;
    this.#windowDrag = windowDrag;
    this.#overZone = over;
    this.#syncZone();
  }

  // A file dragged anywhere over the window wakes the zone, and a drop that
  // misses it does not make the browser navigate away to the file.
  #watchWindowDrag(options) {
    let depth = 0;
    const end = (event) => {
      if (isFileDrag(event)) event.preventDefault();
      depth = 0;
      this.#setDrag({ windowDrag: false, over: 0 });
    };
    window.addEventListener(
      'dragenter',
      (event) => {
        if (!isFileDrag(event)) return;
        depth += 1;
        this.#setDrag({ windowDrag: true });
      },
      options,
    );
    window.addEventListener(
      'dragleave',
      (event) => {
        if (!isFileDrag(event)) return;
        depth = Math.max(0, depth - 1);
        if (depth === 0) this.#setDrag({ windowDrag: false });
      },
      options,
    );
    window.addEventListener('dragover', (event) => isFileDrag(event) && event.preventDefault(), options);
    window.addEventListener('drop', end, options);
    window.addEventListener('dragend', end, options);
  }

  #dragOverZone(event) {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = this.#full ? 'none' : 'copy';
    this.#setDrag({ over: Math.max(1, countDraggedFiles(event.dataTransfer)) });
  }

  #drop(event) {
    event.preventDefault();
    this.#setDrag({ windowDrag: false, over: 0 });
    if (!this.#full) this.addFiles(event.dataTransfer.files);
  }

  #paste(event) {
    if (event.clipboardData.files.length === 0) return;
    event.preventDefault();
    this.addFiles(event.clipboardData.files);
  }
}
