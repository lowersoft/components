import { attributes } from '../../../.storybook/attributes.js';
import '../button/index.js';
import './index.js';

// Sprite Fight by Blender Studio (CC BY 4.0), with its captions, chapters
// and thumbnails, as hosted by Vidstack for demos.
const FILES = 'https://files.vidstack.io/sprite-fight';

const TRACKS = [
  { src: `${FILES}/subs/english.vtt`, label: 'English', language: 'en', kind: 'subtitles', default: true },
  { src: `${FILES}/subs/spanish.vtt`, label: 'Español', language: 'es', kind: 'subtitles' },
  { src: `${FILES}/subs/german.vtt`, label: 'Deutsch', language: 'de', kind: 'subtitles' },
];

const SOURCES = [1080, 720, 480, 360, 240].map((quality) => ({ src: `${FILES}/${quality}p.mp4`, type: 'video/mp4', quality }));

const FILM = {
  heading: 'Sprite Fight',
  byline: 'Blender Studio · CC BY 4.0',
  poster: `${FILES}/poster.webp`,
  tracks: JSON.stringify(TRACKS),
  chapters: `${FILES}/chapters.vtt`,
  thumbnails: `${FILES}/thumbnails.vtt`,
};

const frame = (inner, width = '60rem') => `<div style="width: min(${width}, 100%); margin-inline: auto">${inner}</div>`;

export default {
  title: 'Media/Players/Video Player',
  component: 'lw-video-player',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-video-player ${attributes(args)}></lw-video-player>`),
  args: { src: `${FILES}/720p.mp4`, ...FILM },
};

// Hover the timeline for the frame, chapter and time; open the settings for
// speed, captions and their style; the list icon opens the chapters. Keys:
// K or Space, J and L, the arrows, M, F, C, I, 0 to 9, < and >.
export const Default = {};

// Five files from 240p to 1080p make a quality menu: Auto takes the
// smallest that is sharp at the player's size, and a pick keeps the place.
export const Qualities = {
  args: { src: '', sources: JSON.stringify(SOURCES) },
};

// An HLS stream: hls.js loads from the CDN where the browser cannot play
// it natively, and its levels fill the quality menu.
export const Stream = {
  args: { src: `${FILES}/hls/stream.m3u8`, 'hls-library': 'https://cdn.jsdelivr.net/npm/hls.js@1.7.3/dist/hls.mjs' },
};

// Under 576 px the player turns compact: play and the seek buttons in the
// middle, the menus as sheets. Double tap either side to seek.
export const Compact = {
  render: (args) => frame(`<lw-video-player ${attributes(args)}></lw-video-player>`, '24rem'),
};

// The volume, speed, captions, their style, the quality and the place in
// the video are remembered under `storage` and come back on reload.
export const RemembersSettings = {
  args: { storage: 'lw-video-player-demo' },
};

// Nothing loads until the first play, for pages with many videos.
export const LoadOnPlay = {
  args: { load: 'play', tracks: '', chapters: '', thumbnails: '' },
};

export const Accent = {
  render: (args) => frame(`<lw-video-player style="--lw-video-player-accent: #a78bfa" ${attributes(args)}></lw-video-player>`),
};

export const Unplayable = {
  args: { src: 'https://files.vidstack.io/sprite-fight/missing.mp4', tracks: '', chapters: '', thumbnails: '' },
};

// Drive the player from outside and follow `state` with `subscribe()`.
export const Scripting = {
  render: (args) => {
    const root = document.createElement('div');
    root.style.cssText = 'display: grid; gap: 1rem; width: min(60rem, 100%); margin-inline: auto';
    root.innerHTML = `<lw-video-player ${attributes(args)}></lw-video-player>
<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <lw-button data-do="toggle" variant="secondary" size="sm">Play / pause</lw-button>
  <lw-button data-do="back" variant="outline" size="sm">−10 s</lw-button>
  <lw-button data-do="forward" variant="outline" size="sm">+10 s</lw-button>
  <lw-button data-do="chapter" variant="outline" size="sm">Next chapter</lw-button>
  <lw-button data-do="captions" variant="outline" size="sm">Captions</lw-button>
  <lw-button data-do="speed" variant="outline" size="sm">Speed 1.5×</lw-button>
  <lw-button data-do="fullscreen" variant="outline" size="sm">Fullscreen</lw-button>
</div>
<pre data-state style="margin: 0; padding: 1rem; border: 1px solid var(--lw-color-border); border-radius: var(--lw-radius-lg); background: var(--lw-color-muted); color: var(--lw-color-foreground); font: 0.75rem/1.6 var(--lw-font-mono); white-space: pre-wrap"></pre>`;
    const player = root.querySelector('lw-video-player');
    const actions = {
      toggle: () => player.togglePaused(),
      back: () => player.seekBy(-10),
      forward: () => player.seekBy(10),
      chapter: () => {
        const { chapters, chapter } = player.state;
        const next = chapters[chapter + 1];
        if (next) player.seek(next.start);
      },
      captions: () => player.toggleCaptions(),
      speed: () => (player.playbackRate = player.playbackRate === 1.5 ? 1 : 1.5),
      fullscreen: () => player.enterFullscreen(),
    };
    root.addEventListener('click', (event) => actions[event.target.closest('[data-do]')?.dataset.do]?.());
    const output = root.querySelector('[data-state]');
    player.subscribe((state) => {
      const chapter = state.chapters[state.chapter];
      output.textContent = [
        `paused        ${state.paused}`,
        `currentTime   ${state.currentTime.toFixed(2)} / ${state.duration.toFixed(2)}`,
        `buffered      ${state.bufferedEnd.toFixed(1)}`,
        `volume        ${state.volume.toFixed(2)}${state.muted ? ' (muted)' : ''}`,
        `playbackRate  ${state.playbackRate}`,
        `textTrack     ${state.textTracks[state.textTrack]?.label ?? 'off'}`,
        `chapter       ${chapter ? chapter.title : '—'}`,
        `controls      ${state.controlsVisible ? 'shown' : 'hidden'}   layout ${state.layout}`,
      ].join('\n');
    });
    return root;
  },
};
