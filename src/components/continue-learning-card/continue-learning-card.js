import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './continue-learning-card.scss?inline';

const DEMO_LESSONS = [
  { id: 'l4', title: 'Springs, not curves', duration: 1140, watched: 380, hue: 250 },
  { id: 'l5', title: 'Interrupting animations', duration: 960, hue: 25 },
  { id: 'l6', title: 'Gestures and momentum', duration: 1320, hue: 160 },
  { id: 'l7', title: 'Motion and accessibility', duration: 780, hue: 320 },
];
// The thumbnail is a storyboard of this many frames.
const FRAMES = 12;
const W = 320;
const H = 180;

const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const minutes = (seconds) => `${Math.max(1, Math.round(seconds / 60))} min`;

// One storyboard frame: a slide with a ball travelling its arc, so scrubbing
// reads like flipping through the lesson.
const drawFrame = (ctx, lesson, frame) => {
  const t = frame / (FRAMES - 1);
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, `hsl(${lesson.hue} 45% 22%)`);
  bg.addColorStop(1, `hsl(${(lesson.hue + 40) % 360} 50% 14%)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // The slide's title and lines.
  ctx.fillStyle = 'rgb(255 255 255 / 0.85)';
  ctx.fillRect(24, 24, 120, 10);
  ctx.fillStyle = 'rgb(255 255 255 / 0.3)';
  ctx.fillRect(24, 42, 80, 6);
  // The arc the ball follows, dashed, and the ball where it is now.
  ctx.strokeStyle = 'rgb(255 255 255 / 0.25)';
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(40, 150);
  ctx.quadraticCurveTo(W / 2, 30, W - 40, 150);
  ctx.stroke();
  ctx.setLineDash([]);
  const x = (1 - t) ** 2 * 40 + 2 * (1 - t) * t * (W / 2) + t ** 2 * (W - 40);
  const y = (1 - t) ** 2 * 150 + 2 * (1 - t) * t * 30 + t ** 2 * 150;
  ctx.fillStyle = `hsl(${lesson.hue} 90% 70%)`;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * A continue-watching card for a course. Scrub across the lesson's
 * thumbnail to flip through it like a storyboard, with the time under the
 * pointer, and click to resume from that moment. The next lessons wait
 * below; pick one to make it the current lesson.
 *
 * Lessons are `{ id, title, duration, watched?, hue? }`, in seconds.
 *
 * @attr {string} course
 * @attr {Array<object>} lessons - The lessons, in order (JSON)
 * @attr {string} lesson - The current lesson's id
 * @fires lw-resume - Resume was chosen; `detail: { lesson, time }`
 * @fires lw-change - Another lesson became current; `detail: { lesson }`
 */
export class LwContinueLearningCard extends LwElement {
  static styles = styles;
  static props = {
    course: { default: 'Motion for interfaces' },
    lessons: { type: Object, default: DEMO_LESSONS },
    lesson: { default: '' },
  };

  #frames = [];
  #framesOf = null;
  #scrub = null;

  render() {
    return `<button class="thumb" type="button"><canvas width="${W}" height="${H}"></canvas><span class="play" aria-hidden="true">${strokeIcon(play, 18)}</span><span class="at" aria-hidden="true"></span><span class="playhead" aria-hidden="true"></span><span class="bar" aria-hidden="true"><span class="watched"></span><span class="preview"></span></span></button>
<div class="info"><p class="course"></p><p class="title"></p><p class="left"></p></div>
<p class="up-next">Up next</p><ol class="next"></ol>`;
  }

  connected() {
    const options = { signal: this.signal };
    const thumb = this.query('.thumb');
    thumb.addEventListener('pointermove', (event) => this.#scrubTo(event), options);
    thumb.addEventListener('pointerleave', () => this.#scrubTo(null), options);
    thumb.addEventListener('click', () => this.#resume(), options);
    thumb.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.next').addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) this.#pick(button.dataset.id);
    }, options);
  }

  updated() {
    const lesson = this.#current;
    if (!lesson) return;
    // Every frame is drawn once per lesson, so scrubbing only swaps them.
    if (this.#framesOf !== lesson.id) {
      this.#frames = Array.from({ length: FRAMES }, (_, frame) => {
        const canvas = new OffscreenCanvas(W, H);
        drawFrame(canvas.getContext('2d'), lesson, frame);
        return canvas;
      });
      this.#framesOf = lesson.id;
    }
    const index = this.lessons.indexOf(lesson);
    this.query('.course').textContent = this.course ?? '';
    this.query('.title').textContent = `Lesson ${index + 1} · ${lesson.title}`;
    this.#paint();
    const next = this.lessons.slice(index + 1, index + 4);
    this.query('.up-next').hidden = !next.length;
    this.query('.next').innerHTML = next
      .map((item) => `<li><button type="button" data-id="${escapeHtml(item.id)}"><span class="swatch" style="--_hue: ${item.hue ?? 220}"></span><span class="next-title">${escapeHtml(item.title)}</span><span class="duration">${minutes(item.duration)}</span></button></li>`)
      .join('');
  }

  get #current() {
    return this.lessons.find(({ id }) => id === this.lesson) ?? this.lessons[0];
  }

  // The thumbnail shows the frame at the scrub, else where the watching
  // stopped.
  #paint() {
    const lesson = this.#current;
    const watched = lesson.watched ?? 0;
    const time = this.#scrub ?? watched;
    const frame = Math.min(FRAMES - 1, Math.floor((time / lesson.duration) * FRAMES));
    this.query('canvas').getContext('2d').drawImage(this.#frames[frame], 0, 0);
    const thumb = this.query('.thumb');
    thumb.style.setProperty('--_watched', String(watched / lesson.duration));
    thumb.style.setProperty('--_at', String(time / lesson.duration));
    thumb.toggleAttribute('data-scrubbing', this.#scrub !== null);
    this.query('.at').textContent = clock(time);
    thumb.ariaLabel = `Resume ${lesson.title} from ${clock(time)}`;
    this.query('.left').textContent = watched ? `${minutes(lesson.duration - watched)} left` : minutes(lesson.duration);
  }

  #scrubTo(event) {
    if (!event) {
      this.#scrub = null;
    } else {
      const rect = this.query('.thumb').getBoundingClientRect();
      this.#scrub = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)) * this.#current.duration;
    }
    this.#paint();
  }

  // The arrow keys scrub ten seconds at a time.
  #key(event) {
    const step = { ArrowRight: 10, ArrowLeft: -10 }[event.key];
    if (!step) return;
    event.preventDefault();
    const lesson = this.#current;
    this.#scrub = Math.min(lesson.duration, Math.max(0, (this.#scrub ?? lesson.watched ?? 0) + step));
    this.#paint();
  }

  #resume() {
    const lesson = this.#current;
    const time = this.#scrub ?? lesson.watched ?? 0;
    this.lessons = this.lessons.map((item) => (item === lesson ? { ...item, watched: time } : item));
    this.#scrub = null;
    if (!reducedMotion.matches) this.query('.play').animate([{ scale: 1 }, { scale: 1.25 }, { scale: 1 }], { duration: 300, easing: 'ease-out' });
    this.emit('resume', { lesson: lesson.id, time });
  }

  #pick(id) {
    this.lesson = id;
    if (!reducedMotion.matches) this.query('.thumb').animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
    this.emit('change', { lesson: id });
  }
}
