import '../button/index.js';
import { escapeHtml, isTyping } from '../../core/dom.js';
import { SPINNER_ICON, strokeIcon } from '../../core/icons.js';
import {
  airplay,
  audioLines,
  captions,
  cast,
  gauge,
  listVideo,
  maximize,
  minimize,
  pause,
  pictureInPicture2,
  play,
  repeat,
  rotateCcw,
  rotateCw,
  settings,
  slidersHorizontal,
  triangleAlert,
  type,
  volume1,
  volume2,
  volumeX,
} from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { IS_APPLE } from '../../core/platform.js';
import { watchVisibility } from '../../core/visibility.js';
import { chaptersFromCues, fetchText, itemAt, listOrUrl, normalizeChapters, normalizeThumbnails, parseCues, thumbnailsFromCues, toVtt } from './cues.js';
import { MenuPanel } from './menu-panel.js';
import { STRINGS } from './strings.js';
import styles from './video-player.scss?inline';

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Seconds the arrow keys seek, and the volume they step.
const KEY_STEP = 5;
const VOLUME_STEP = 0.05;
// Below this width or height the player takes its compact, touch layout.
const SMALL_WIDTH = 576;
const SMALL_HEIGHT = 320;
// While scrubbing, the media seeks at most this often, in ms.
const SEEK_THROTTLE = 90;
// A live stream within this many seconds of its edge counts as live, and
// one with a window this long can be seeked.
const LIVE_TOLERANCE = 10;
const DVR_WINDOW = 60;
// A second tap this soon is a double tap; taps this soon after a seek keep seeking.
const DOUBLE_TAP = 300;
const TAP_SERIES = 700;
// How often the playback position is saved, in ms.
const SAVE_EVERY = 5000;
const FRAME = 1 / 30;

const SHORTCUTS = {
  togglePaused: 'k Space',
  seekBackward: 'ArrowLeft',
  seekForward: 'ArrowRight',
  jumpBackward: 'j',
  jumpForward: 'l',
  volumeUp: 'ArrowUp',
  volumeDown: 'ArrowDown',
  toggleMuted: 'm',
  toggleFullscreen: 'f',
  togglePictureInPicture: 'i',
  toggleCaptions: 'c',
  speedUp: '>',
  speedDown: '<',
  previousFrame: ',',
  nextFrame: '.',
  seekToStart: 'Home',
  seekToEnd: 'End',
  seekToPercent: '0 1 2 3 4 5 6 7 8 9',
};

const KEY_LABELS = { Space: 'Space', ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', Home: 'Home', End: 'End' };

const CAPTION_STYLES = {
  size: [
    ['small', 'sizeSmall', 0.75],
    ['default', 'sizeDefault', 1],
    ['large', 'sizeLarge', 1.25],
    ['larger', 'sizeLarger', 1.5],
    ['largest', 'sizeLargest', 2],
  ],
  color: [
    ['white', 'colorWhite', '#fafafa'],
    ['yellow', 'colorYellow', '#fde047'],
    ['cyan', 'colorCyan', '#67e8f9'],
    ['green', 'colorGreen', '#86efac'],
  ],
  background: [
    ['translucent', 'backgroundTranslucent', 0.72],
    ['solid', 'backgroundSolid', 1],
    ['none', 'backgroundNone', 0],
  ],
  edge: [
    ['none', 'edgeNone', 'none'],
    ['shadow', 'edgeShadow', '0 0.08em 0.2em rgb(0 0 0 / 0.9), 0 0 0.5em rgb(0 0 0 / 0.5)'],
    ['outline', 'edgeOutline', '-0.06em -0.06em 0 #000, 0.06em -0.06em 0 #000, -0.06em 0.06em 0 #000, 0.06em 0.06em 0 #000'],
  ],
};
const STYLE_PAGES = { size: 'textSize', color: 'textColor', background: 'background', edge: 'textEdge' };
const DEFAULT_STYLE = { size: 'default', color: 'white', background: 'translucent', edge: 'none' };

// Where each control goes in either layout; the rest wait in the pool.
const LAYOUTS = {
  lg: {
    'top-start': ['titles'],
    'top-end': [],
    center: [],
    'bottom-start': ['play', 'volume', 'time', 'chapter'],
    'bottom-end': ['live', 'chapters', 'captions', 'settings', 'pip', 'cast', 'fullscreen'],
  },
  sm: {
    'top-start': ['titles'],
    'top-end': ['volume', 'chapters', 'captions', 'settings', 'cast'],
    center: ['backward', 'play', 'forward'],
    'bottom-start': ['time', 'chapter', 'live'],
    'bottom-end': ['pip', 'fullscreen'],
  },
};

const TYPES = { m3u8: 'application/x-mpegurl', mpd: 'application/dash+xml', mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', ogg: 'video/ogg', mov: 'video/quicktime', mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', opus: 'audio/ogg' };

const ERRORS = { 1: 'errorAborted', 2: 'errorNetwork', 3: 'errorDecode', 4: 'errorUnsupported', hls: 'errorHls' };

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

/** `1:05`, `12:40` or `1:02:03`; with `hours`, always with the hours. */
const clock = (seconds, hours = false) => {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, '0');
  return h || hours ? `${h}:${String(m).padStart(2, '0')}:${rest}` : `${m}:${rest}`;
};

const typeOf = (src) => {
  try {
    const extension = new URL(src, document.baseURI).pathname.split('.').pop().toLowerCase();
    return TYPES[extension] ?? '';
  } catch {
    return '';
  }
};

const isHls = (source) => /mpegurl/i.test(source.type);

const glyph = (inner, name = '') => `<span class="glyph${name ? ` ${name}` : ''}">${strokeIcon(inner, 24)}</span>`;

// Only one player at a time speaks to the system's media controls.
let sessionOwner = null;

/**
 * A video player in the spirit of Vidstack: a full set of controls that fade
 * away while the video plays, over any video the browser can play, HLS
 * streams through hls.js, and the timed text around them.
 *
 * The timeline is split into chapters, fills as the video buffers and
 * plays, and previews the frame, chapter and time under the pointer from a
 * thumbnails file. Settings slide between pages for the speed, quality,
 * captions, their style, the audio track and looping; chapters have a menu
 * of their own. Captions are drawn by the player, so they sit above the
 * controls and take the viewer's style. There is picture-in-picture,
 * fullscreen that turns a phone to landscape, AirPlay and casting where the
 * browser offers them, and the system's media controls.
 *
 * Below 576 px wide (or 320 px tall) the layout turns compact: the main
 * buttons in the middle, the rest along the top, and menus as sheets. A
 * mouse click plays or pauses and a double click goes fullscreen; a tap
 * shows or hides the controls, and a double tap on either side seeks, faster
 * with every tap. Keyboard shortcuts follow YouTube's and can be remapped.
 *
 * Sources are `src`, or `sources` as `[{ src, type?, quality?, label? }]`
 * where files of several heights (`quality: 1080`) make a quality menu; a
 * `<source>` child works too, its height in `data-quality`. Text tracks are
 * `[{ src | content, kind?, label, language, default? }]` in WebVTT or SRT,
 * or `<track>` children. Chapters and thumbnails take a WebVTT file's URL or
 * an array: `[{ start, end?, title }]` and `[{ start, url, x?, y?, width?,
 * height? }]`.
 *
 * Script it like the media element: `play()`, `pause()`, `seek(time)`,
 * `currentTime`, `volume`, `muted`, `playbackRate` and the rest, plus
 * `subscribe(callback)` for every change of `state`, a snapshot of what the
 * player is doing. The host carries the same as `data-*` attributes
 * (`data-paused`, `data-waiting`, `data-controls`, `data-layout`, …) to style
 * against.
 *
 * @attr {string} src - The video to play
 * @attr {Array<object>} sources - Sources to choose from, or of several qualities (JSON)
 * @attr {string} poster - The image shown until the video starts
 * @attr {string} heading - The video's title, over the top and to the system's media controls
 * @attr {string} byline - Who it is from, under the title
 * @attr {Array<object>} tracks - Captions and subtitles (JSON)
 * @attr {string} chapters - A chapters WebVTT file, or the chapters (JSON)
 * @attr {string} thumbnails - A thumbnails WebVTT file, or the thumbnails (JSON)
 * @attr {boolean} autoplay - Play once loaded, muted if the browser insists
 * @attr {boolean} muted
 * @attr {number} volume - From 0 to 1
 * @attr {number} playback-rate
 * @attr {boolean} loop
 * @attr {number} start-time - Where to start, in seconds
 * @attr {string} preload - `none`, `metadata` or `auto`, once loading
 * @attr {string} load - When to load: `eager`, `idle`, `visible` (on screen) or `play` (on the first play)
 * @attr {string} crossorigin - The media's CORS mode
 * @attr {number} seek-step - Seconds the seek buttons, J, L and double taps move
 * @attr {Array<number>} speeds - The playback speeds offered (JSON)
 * @attr {number} hide-delay - How long the controls stay after the pointer rests, in ms
 * @attr {string} keyboard - Where shortcuts listen: `player` (when it has focus), `document` or `off`
 * @attr {object} key-shortcuts - Keys per action, like `{ "togglePaused": "k Space" }`; empty turns one off (JSON)
 * @attr {string} storage - A key to remember the volume, speed, captions, quality and position under
 * @attr {string} hls-library - Where to import hls.js from; or set the property to the class or a function that loads it
 * @attr {object} hls-config - Options for hls.js (JSON)
 * @attr {object} translations - Words to replace, by key (JSON)
 * @fires lw-play - Playback was asked to start
 * @fires lw-playing - Playback started
 * @fires lw-pause
 * @fires lw-ended
 * @fires lw-waiting - Playback stopped to buffer
 * @fires lw-can-play
 * @fires lw-loaded-metadata - `detail: { duration, width, height }`
 * @fires lw-duration-change - `detail: { duration }`
 * @fires lw-time-update - `detail: { currentTime }`
 * @fires lw-seeking - `detail: { currentTime }`
 * @fires lw-seeked - `detail: { currentTime }`
 * @fires lw-volume-change - `detail: { volume, muted }`
 * @fires lw-rate-change - `detail: { playbackRate }`
 * @fires lw-source-change - `detail: { source }`
 * @fires lw-quality-change - `detail: { quality, auto }`
 * @fires lw-text-track-change - `detail: { track }`, null when off
 * @fires lw-audio-track-change - `detail: { track }`
 * @fires lw-chapter-change - `detail: { chapter }`
 * @fires lw-fullscreen-change - `detail: { fullscreen }`
 * @fires lw-picture-in-picture-change - `detail: { pictureInPicture }`
 * @fires lw-controls-change - `detail: { visible }`
 * @fires lw-error - `detail: { code, message }`
 * @slot - `<source>` and `<track>` elements
 * @csspart video - The video element
 * @csspart poster
 * @csspart captions
 * @csspart controls - The bottom bar
 * @csspart top-bar
 * @csspart menu - The settings and chapters menus
 * @cssprop --lw-video-player-accent - The played part of the timeline and the sliders; near white by default
 * @cssprop --lw-video-player-aspect-ratio - 16 / 9 by default
 * @cssprop --lw-video-player-radius - The corners, outside fullscreen
 * @cssprop --lw-video-player-fit - How the video fills the frame: `contain` by default
 */
export class LwVideoPlayer extends LwElement {
  static styles = styles;
  static props = {
    src: {},
    sources: { type: Object },
    poster: {},
    heading: {},
    byline: {},
    tracks: { type: Object },
    chapters: {},
    thumbnails: {},
    autoplay: { type: Boolean },
    muted: { type: Boolean },
    volume: { type: Number, default: 1 },
    playbackRate: { type: Number, default: 1 },
    loop: { type: Boolean },
    startTime: { type: Number, default: 0 },
    preload: { default: 'metadata' },
    load: { default: 'visible' },
    crossorigin: {},
    seekStep: { type: Number, default: 10 },
    speeds: { type: Object, default: SPEEDS },
    hideDelay: { type: Number, default: 2500 },
    keyboard: { default: 'player' },
    keyShortcuts: { type: Object },
    storage: {},
    hlsLibrary: {},
    hlsConfig: { type: Object },
    translations: { type: Object },
  };

  #state = {
    source: null,
    canPlay: false,
    started: false,
    paused: true,
    playing: false,
    ended: false,
    seeking: false,
    waiting: false,
    currentTime: 0,
    duration: 0,
    bufferedEnd: 0,
    seekableStart: 0,
    seekableEnd: 0,
    live: false,
    liveEdge: false,
    volume: 1,
    muted: false,
    playbackRate: 1,
    loop: false,
    qualities: [],
    quality: 'auto',
    activeQuality: -1,
    textTracks: [],
    textTrack: -1,
    audioTracks: [],
    audioTrack: -1,
    chapters: [],
    chapter: -1,
    fullscreen: false,
    pictureInPicture: false,
    canFullscreen: false,
    canPictureInPicture: false,
    canCast: false,
    casting: 'disconnected',
    controlsVisible: true,
    menu: null,
    error: null,
    width: 0,
    height: 0,
    layout: 'lg',
  };

  #dirty = new Set();
  #subscribers = new Set();
  #booted = false;
  #attached = false;
  #loadToken = 0;
  #planCancel = null;
  #lastSources = '';
  #lastTracks = '';
  #files = [];
  #hls = null;
  #hlsLevels = [];
  #pending = null;
  #frame = 0;
  #visible = true;
  #scrub = null;
  #scrubbing = false;
  #lastSeek = 0;
  #seekTimer = 0;
  #hoverTime = null;
  #remaining = false;
  #shownSecond = '';
  #hideTimer = 0;
  #overControls = false;
  #focusVisible = false;
  #press = null;
  #taps = { time: 0, zone: 0, wasVisible: true, series: 0 };
  #ripple = { side: 0, total: 0, timer: 0 };
  #trackObjects = [];
  #trackUrls = [];
  #trackDefaults = new Map();
  #captionsChoice = undefined;
  #lastTrack = -1;
  #cueTrack = null;
  #captionStyle = { ...DEFAULT_STYLE };
  #thumbs = [];
  #keys = new Map();
  #keyTarget = null;
  #tipTimer = 0;
  #tipWarm = 0;
  #lastSave = 0;
  #settings = null;
  #chapterMenu = null;
  #tracksToken = 0;
  #chaptersToken = 0;
  #thumbsToken = 0;
  // Loads cut short by a disconnect, by name, to run again on reconnecting.
  #interrupted = new Map();
  #previewTimer = 0;
  #tipControl = null;
  #segments = [[0, 1]];
  #ariaSecond = -1;
  #durationFormat = null;

  // ---- Public API ----

  /** A snapshot of what the player is doing; `subscribe()` hears every change. */
  get state() {
    return Object.freeze({ ...this.#state });
  }

  /**
   * Call `callback(state, changed)` now and after every change, with the
   * set of keys that changed. Returns a function that stops it.
   */
  subscribe(callback) {
    this.#subscribers.add(callback);
    callback(this.state, new Set(Object.keys(this.#state)));
    return () => this.#subscribers.delete(callback);
  }

  /** The `<video>` element. */
  get media() {
    return this.query('.media');
  }

  /** The hls.js instance while a stream plays through it, otherwise null. */
  get hls() {
    return this.#hls;
  }

  get paused() {
    return this.#state.paused;
  }

  get ended() {
    return this.#state.ended;
  }

  get duration() {
    return this.#state.duration;
  }

  get currentTime() {
    return this.media?.currentTime ?? 0;
  }

  set currentTime(time) {
    this.seek(time);
  }

  /** Start playing, loading first if need be. Resolves once it plays. */
  async play() {
    if (!this.#attached) await this.#attach();
    return this.#playMedia();
  }

  pause() {
    this.media?.pause();
  }

  togglePaused() {
    return this.media?.paused ? this.play() : this.pause();
  }

  /** Seek to `time` in seconds, within what can be seeked. */
  seek(time) {
    const media = this.media;
    if (!media || !Number.isFinite(Number(time))) return;
    const { start, end } = this.#range();
    const target = clamp(Number(time), start, end || Number(time));
    if (media.readyState === 0) this.#pending = { ...this.#pending, at: target };
    else media.currentTime = target;
    this.#set({ currentTime: target, ended: false });
  }

  seekBy(delta) {
    this.seek(this.currentTime + Number(delta));
  }

  seekToLiveEdge() {
    const edge = this.#hls?.liveSyncPosition ?? this.#state.seekableEnd;
    if (Number.isFinite(edge)) this.seek(edge);
  }

  async enterFullscreen() {
    const media = this.media;
    if (document.fullscreenElement === this) return;
    if (document.fullscreenEnabled && this.requestFullscreen) await this.requestFullscreen({ navigationUI: 'hide' });
    else if (document.webkitFullscreenEnabled && this.webkitRequestFullscreen) this.webkitRequestFullscreen();
    // iPhone: only the video itself, with the system's controls.
    else if (media.webkitEnterFullscreen) media.webkitEnterFullscreen();
    else return;
    // A landscape video turns a phone sideways while it fills the screen.
    if (matchMedia('(pointer: coarse)').matches && media.videoWidth > media.videoHeight) screen.orientation?.lock?.('landscape').catch(() => {});
  }

  async exitFullscreen() {
    if (document.fullscreenElement === this) await document.exitFullscreen();
    else if (document.webkitFullscreenElement === this) document.webkitExitFullscreen();
    else if (this.media.webkitDisplayingFullscreen) this.media.webkitExitFullscreen();
  }

  toggleFullscreen() {
    return this.#state.fullscreen ? this.exitFullscreen() : this.enterFullscreen();
  }

  async enterPictureInPicture() {
    const media = this.media;
    if (media.requestPictureInPicture && document.pictureInPictureEnabled) await media.requestPictureInPicture();
    else media.webkitSetPresentationMode?.('picture-in-picture');
  }

  async exitPictureInPicture() {
    const media = this.media;
    if (this.shadowRoot.pictureInPictureElement === media) await document.exitPictureInPicture();
    else if (media.webkitPresentationMode === 'picture-in-picture') media.webkitSetPresentationMode('inline');
  }

  togglePictureInPicture() {
    return this.#state.pictureInPicture ? this.exitPictureInPicture() : this.enterPictureInPicture();
  }

  /** Pick a quality by its id from `state.qualities`, or `'auto'`. */
  setQuality(id) {
    const qualities = this.#state.qualities;
    const auto = id === 'auto' || !qualities.some((quality) => quality.id === id);
    this.#set({ quality: auto ? 'auto' : id });
    this.#save({ quality: auto ? 'auto' : qualities.find((quality) => quality.id === id).height });
    if (this.#hls) {
      this.#hls.currentLevel = auto ? -1 : id;
      this.#set({ activeQuality: auto ? this.#hls.currentLevel : id });
    } else if (this.#files.length > 1) this.#playFile(auto ? this.#autoFile() : id);
    this.emit('quality-change', { quality: this.#state.quality, auto });
  }

  /** Show the text track with this id from `state.textTracks`, or none with -1. */
  setTextTrack(id) {
    const tracks = this.#trackObjects;
    const index = id >= 0 && id < tracks.length ? id : -1;
    tracks.forEach((track, i) => {
      track.mode = i === index ? 'hidden' : 'disabled';
    });
    if (this.#hls && this.#hls.subtitleTracks?.length) {
      const match = this.#hls.subtitleTracks.findIndex((track) => track.name === tracks[index]?.label && track.lang === tracks[index]?.language);
      this.#hls.subtitleTrack = match;
    }
    this.#captionsChoice = index;
    if (index >= 0) this.#lastTrack = index;
    this.#watchCues(tracks[index] ?? null);
    this.#set({ textTrack: index });
    this.#save({ captions: index >= 0 ? tracks[index].language || tracks[index].label : 'off' });
    this.emit('text-track-change', { track: this.#state.textTracks[index] ?? null });
  }

  /** Turn captions on, with the last track shown or the first, or off. */
  toggleCaptions() {
    if (this.#state.textTrack >= 0) this.setTextTrack(-1);
    else if (this.#trackObjects.length) this.setTextTrack(this.#lastTrack >= 0 ? this.#lastTrack : this.#preferredTrack());
  }

  /** Play the audio track with this id from `state.audioTracks`. */
  setAudioTrack(id) {
    if (this.#hls) this.#hls.audioTrack = id;
    else {
      const tracks = this.media.audioTracks;
      if (!tracks) return;
      for (let i = 0; i < tracks.length; i++) tracks[i].enabled = i === id;
    }
    this.#set({ audioTrack: id });
    this.emit('audio-track-change', { track: this.#state.audioTracks.find((track) => track.id === id) ?? null });
  }

  /** Offer to play on another screen: AirPlay on Apple devices, casting elsewhere. */
  requestCast() {
    const media = this.media;
    if (media.webkitShowPlaybackTargetPicker) media.webkitShowPlaybackTargetPicker();
    else media.remote?.prompt().catch(() => {});
  }

  /** Load now, whatever `load` says. */
  startLoading() {
    return this.#attach();
  }

  /** Show the controls, hiding them again after `hide-delay` while playing. */
  showControls() {
    this.#showControls();
  }

  hideControls() {
    clearTimeout(this.#hideTimer);
    if (!this.#state.paused && !this.#state.menu) this.#setControls(false);
  }

  // ---- Element ----

  render() {
    const button = (control, inner, extra = '') => `<button class="control ${control}" type="button" data-control="${control}"${extra}>${inner}</button>`;
    const seek = (control, arc) => button(control, `${glyph(arc)}<span class="seek-amount"></span>`);
    const castIcon = IS_APPLE && 'WebKitPlaybackTargetAvailabilityEvent' in window ? airplay : cast;
    return `<video class="media" part="video" playsinline webkit-playsinline preload="none"></video>
<img class="poster" part="poster" alt="" decoding="async" hidden>
<div class="cue-layer" part="captions" aria-hidden="true"></div>
<div class="gestures"></div>
<div class="scrim" aria-hidden="true"></div>
<div class="feedback" aria-hidden="true"><div class="bezel"><span class="bezel-icon"></span><span class="bezel-text"></span></div><div class="ripple" data-side="-1"><span class="chevrons"><i></i><i></i><i></i></span><span class="ripple-text"></span></div><div class="ripple" data-side="1"><span class="chevrons"><i></i><i></i><i></i></span><span class="ripple-text"></span></div></div>
<div class="spinner" aria-hidden="true">${SPINNER_ICON}</div>
<div class="bar top" part="top-bar"><div class="group" data-group="top-start"></div><div class="group" data-group="top-end"></div></div>
<button class="start" type="button" part="start">${glyph(play)}</button>
<div class="group center" data-group="center"></div>
<div class="bar bottom" part="controls"><div class="timeline" role="slider" tabindex="0" aria-valuemin="0"><div class="segments"></div><span class="knob"></span><div class="preview" aria-hidden="true"><span class="frame"><img alt=""></span><span class="preview-chapter"></span><span class="preview-time"></span></div></div><div class="row"><div class="group" data-group="bottom-start"></div><div class="group" data-group="bottom-end"></div></div></div>
<div class="menu-scrim"></div>
<div class="panel" id="settings-menu" role="menu" part="menu"><div class="pages"></div></div>
<div class="panel" id="chapters-menu" role="menu" part="menu"><div class="pages"></div></div>
<div class="tooltip" aria-hidden="true"><span class="tooltip-text"></span><kbd></kbd></div>
<div class="error" role="alert" hidden><span class="error-icon">${strokeIcon(triangleAlert, 22)}</span><p class="error-title"></p><p class="error-message"></p><lw-button class="retry" size="sm"></lw-button></div>
<div class="announcer" aria-live="polite" aria-atomic="true"></div>
<div class="pool" hidden><div class="titles" data-control="titles"><p class="heading"></p><p class="byline"></p></div>
${button('play', `${glyph(play, 'when-paused')}${glyph(pause, 'when-playing')}${glyph(rotateCcw, 'when-ended')}`)}
${seek('backward', rotateCcw)}${seek('forward', rotateCw)}
<div class="volume" data-control="volume">${button('mute', `${glyph(volume2, 'when-high')}${glyph(volume1, 'when-low')}${glyph(volumeX, 'when-muted')}`)}<div class="volume-slider" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><span class="rail"><span class="level"></span></span><span class="knob"></span></div></div>
<button class="time" type="button" data-control="time"><span class="current">0:00</span><span class="divider">/</span><span class="total">0:00</span></button>
<span class="chapter-title" data-control="chapter"></span>
<button class="live" type="button" data-control="live"><span class="live-dot"></span><span class="live-text"></span></button>
${button('chapters', glyph(listVideo), ' aria-haspopup="menu"')}${button('captions', glyph(captions), ' aria-pressed="false"')}${button('settings', glyph(settings), ' aria-haspopup="menu"')}${button('pip', glyph(pictureInPicture2), ' aria-pressed="false"')}${button('cast', glyph(castIcon))}${button('fullscreen', `${glyph(maximize, 'when-inline')}${glyph(minimize, 'when-fullscreen')}`)}</div>
<slot hidden></slot>`;
  }

  connected() {
    const options = { signal: this.signal };
    const media = this.media;
    if (!this.#booted) this.#boot();
    else if (!this.#attached) this.#plan();
    else if (this.#pending?.reconnect) this.#loadSource({ at: this.#pending.at, play: false });

    this.#bindMedia(media, options);
    this.#bindControls(options);
    this.#bindGestures(options);
    this.#bindSliders(options);
    this.#bindTooltips(options);
    this.#settings.connect(this.signal);
    this.#chapterMenu.connect(this.signal);
    for (const load of this.#interrupted.values()) load();
    this.#interrupted.clear();

    document.addEventListener('fullscreenchange', () => this.#syncFullscreen(), options);
    document.addEventListener('webkitfullscreenchange', () => this.#syncFullscreen(), options);
    addEventListener('pagehide', () => this.#saveTime(true), options);
    this.query('slot').addEventListener('slotchange', () => this.#childrenChanged(), options);

    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(this);
    resize.observe(this.query('.bar.bottom'));
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#loop();
    }, this.signal);
    this.#watchRemote(options);
    this.#bindKeyboard();

    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      clearTimeout(this.#hideTimer);
      clearTimeout(this.#tipTimer);
      this.#planCancel?.();
      this.#releaseSession();
      this.#saveTime(true);
      // A stream reloads where it was if the player comes back.
      if (this.#hls) {
        this.#pending = { at: this.currentTime, reconnect: true };
        this.#detachHls();
      }
    });
  }

  updated(changed) {
    const media = this.media;
    if (changed.has('translations')) this.#paintLabels();
    if (changed.has('heading') || changed.has('byline') || changed.has('translations')) {
      this.query('.heading').textContent = this.heading ?? '';
      this.query('.byline').textContent = this.byline ?? '';
      this.toggleAttribute('data-titled', Boolean(this.heading || this.byline));
      this.ariaLabel = this.heading || this.#t('player');
    }
    if (changed.has('poster')) {
      const poster = this.query('.poster');
      if (this.poster) poster.src = this.poster;
      else poster.removeAttribute('src');
      poster.hidden = !this.poster;
    }
    if (changed.has('crossorigin')) {
      if (this.crossorigin == null) media.removeAttribute('crossorigin');
      else media.crossOrigin = this.crossorigin;
    }
    if (changed.has('volume')) media.volume = clamp(Number(this.volume ?? 1) || 0, 0, 1);
    if (changed.has('muted')) media.muted = Boolean(this.muted);
    if (changed.has('playbackRate')) {
      const rate = clamp(Number(this.playbackRate) || 1, 0.0625, 16);
      media.defaultPlaybackRate = rate;
      media.playbackRate = rate;
    }
    if (changed.has('loop')) {
      media.loop = Boolean(this.loop);
      this.#set({ loop: media.loop });
    }
    if (changed.has('keyShortcuts')) this.#keys = this.#keyMap();
    if (changed.has('keyboard')) this.#bindKeyboard();
    if (changed.has('seekStep') || changed.has('translations') || changed.has('keyShortcuts')) this.#paintSeekButtons();
    if (changed.has('src') || changed.has('sources')) this.#sourcesChanged();
    else if (changed.has('load') && !this.#attached) this.#plan();
    // A stream reloads through the new hls.js, where it was.
    if ((changed.has('hlsLibrary') || changed.has('hlsConfig')) && this.#attached && this.#state.source && isHls(this.#state.source)) this.#loadSource({ at: this.currentTime, play: !this.media.paused });
    if (changed.has('tracks')) this.#loadTracks();
    if (changed.has('chapters')) this.#loadChapters();
    if (changed.has('thumbnails')) this.#loadThumbnails();
    if (changed.has('speeds') || changed.has('translations')) this.#settings.refresh();
    if (changed.has('translations')) this.#paint(new Set(Object.keys(this.#state)));
  }

  // ---- State ----

  #set(patch) {
    for (const [key, value] of Object.entries(patch)) {
      if (Object.is(this.#state[key], value)) continue;
      this.#state[key] = value;
      if (this.#dirty.size === 0) queueMicrotask(() => this.#commit());
      this.#dirty.add(key);
    }
  }

  #commit() {
    const changed = this.#dirty;
    if (changed.size === 0) return;
    this.#dirty = new Set();
    this.#paint(changed);
    const state = this.state;
    for (const callback of this.#subscribers) {
      try {
        callback(state, changed);
      } catch (error) {
        reportError(error);
      }
    }
  }

  #t(key, values = {}) {
    const text = this.translations?.[key] ?? STRINGS[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
  }

  // ---- Boot ----

  #boot() {
    this.#booted = true;
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.role = 'region';
    this.#keys = this.#keyMap();
    this.#settings = new MenuPanel({ panel: this.query('#settings-menu'), trigger: this.query('.control.settings'), pages: (id) => this.#settingsPage(id), onToggle: (open) => this.#menuToggled('settings', open) });
    this.#chapterMenu = new MenuPanel({ panel: this.query('#chapters-menu'), trigger: this.query('.control.chapters'), pages: () => this.#chaptersPage(), onToggle: (open) => this.#menuToggled('chapters', open) });
    // What the viewer chose last time wins over the page's defaults.
    const stored = this.#stored();
    if (Number.isFinite(stored.volume)) this.setValue('volume', stored.volume);
    if (typeof stored.muted === 'boolean') this.setValue('muted', stored.muted);
    if (Number.isFinite(stored.playbackRate)) this.setValue('playbackRate', stored.playbackRate);
    if (stored.captionStyle) this.#captionStyle = { ...DEFAULT_STYLE, ...stored.captionStyle };
    this.#paintCaptionStyle();
    this.#arrange();
    this.#set({ canFullscreen: Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled || this.media.webkitSupportsFullscreen), canPictureInPicture: this.#canPip() });
  }

  #canPip() {
    const media = this.media;
    return Boolean((document.pictureInPictureEnabled && !media.disablePictureInPicture) || media.webkitSupportsPresentationMode?.('picture-in-picture'));
  }

  #keyMap() {
    const map = new Map();
    for (const [action, keys] of Object.entries({ ...SHORTCUTS, ...this.keyShortcuts })) {
      const tokens = Array.isArray(keys) ? keys : String(keys ?? '').split(/\s+/);
      map.set(action, tokens.filter(Boolean));
    }
    return map;
  }

  // ---- Sources ----

  #sourceList() {
    const children = [...this.querySelectorAll(':scope > source')].map((source) => ({ src: source.getAttribute('src'), type: source.type, quality: source.dataset.quality, label: source.dataset.label }));
    const list = [...(this.src ? [{ src: this.src }] : []), ...(Array.isArray(this.sources) ? this.sources : []), ...children];
    const seen = new Set();
    return list
      .filter((source) => source?.src && !seen.has(source.src) && seen.add(source.src))
      .map(({ src, type: kind, quality, label }) => ({ src: String(src), type: kind || typeOf(src), quality: Number(quality) || 0, label: label ? String(label) : '' }));
  }

  #playable(source) {
    const media = this.media;
    if (isHls(source)) return Boolean(media.canPlayType('application/vnd.apple.mpegurl')) || (this.#hasHlsLibrary() && 'MediaSource' in window);
    return !source.type || media.canPlayType(source.type) !== '';
  }

  #hasHlsLibrary() {
    return Boolean(this.hlsLibrary) || typeof window.Hls === 'function';
  }

  #childrenChanged() {
    const sources = JSON.stringify(this.#sourceList());
    if (sources !== this.#lastSources) this.#sourcesChanged();
    const tracks = JSON.stringify(this.#trackList());
    if (tracks !== this.#lastTracks) this.#loadTracks();
  }

  #sourcesChanged() {
    const key = JSON.stringify(this.#sourceList());
    if (this.#attached && key === this.#lastSources) return;
    this.#lastSources = key;
    if (this.#attached) this.#loadSource({ at: 0, play: this.autoplay });
    else this.#plan();
  }

  // Loads when `load` says: now, when the browser is idle, once on screen, or
  // on the first play.
  #plan() {
    this.#planCancel?.();
    this.#planCancel = null;
    if (!this.#sourceList().length) return;
    const strategy = this.load;
    if (strategy === 'play') return;
    if (strategy === 'eager') {
      this.#attach();
      return;
    }
    if (strategy === 'idle') {
      const id = (window.requestIdleCallback ?? setTimeout)(() => this.#attach(), { timeout: 2000 });
      this.#planCancel = () => (window.cancelIdleCallback ?? clearTimeout)(id);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      this.#attach();
    }, { rootMargin: '200px' });
    observer.observe(this);
    this.#planCancel = () => observer.disconnect();
  }

  #attach() {
    this.#planCancel?.();
    if (this.#attached) return Promise.resolve();
    this.#attached = true;
    this.#lastSources = JSON.stringify(this.#sourceList());
    return this.#loadSource({ at: this.#pending?.at ?? (this.startTime || 0), play: this.autoplay });
  }

  // Picks a source the browser can play: through hls.js for a stream when it
  // can, natively otherwise. Files of several heights become qualities.
  async #loadSource({ at = 0, play: shouldPlay = false } = {}) {
    const token = ++this.#loadToken;
    const media = this.media;
    this.#detachHls();
    const list = this.#sourceList();
    const playable = list.filter((source) => this.#playable(source));
    this.#set({ error: null, canPlay: false, started: false, live: false, liveEdge: false, duration: 0, bufferedEnd: 0, ended: false, qualities: [], activeQuality: -1, audioTracks: [], audioTrack: -1 });
    this.#pending = { at, play: shouldPlay };
    if (!list.length) {
      media.removeAttribute('src');
      media.load();
      this.#set({ source: null });
      return;
    }
    if (!playable.length) {
      this.#fail(isHls(list[0]) ? 'hls' : 4);
      return;
    }
    const first = playable[0];
    if (isHls(first)) {
      const Hls = await this.#hlsClass().catch(() => null);
      if (token !== this.#loadToken) return;
      if (Hls?.isSupported?.()) {
        this.#attachHls(Hls, first);
        if (shouldPlay) this.#playMedia(true);
        return;
      }
      if (!media.canPlayType('application/vnd.apple.mpegurl')) {
        this.#fail('hls');
        return;
      }
    }
    this.#files = isHls(first) ? [first] : playable.filter((source) => source.type === first.type && source.quality > 0);
    if (this.#files.length > 1) {
      this.#files.sort((a, b) => b.quality - a.quality);
      this.#set({ qualities: this.#files.map((source, id) => ({ id, height: source.quality, label: source.label || `${source.quality}p`, bitrate: 0 })) });
      const stored = this.#stored().quality;
      const choice = this.#state.quality !== 'auto' && this.#files[this.#state.quality] ? this.#state.quality : Number.isFinite(stored) ? this.#closestFile(stored) : 'auto';
      this.#set({ quality: choice });
      this.#playFile(choice === 'auto' ? this.#autoFile() : choice, { at, play: shouldPlay });
      return;
    }
    this.#files = [first];
    this.#setSource(first, { at, play: shouldPlay });
  }

  #setSource(source, { at, play: shouldPlay }) {
    const media = this.media;
    this.#pending = { at, play: shouldPlay };
    media.preload = this.preload === 'none' && !shouldPlay ? 'none' : this.preload || 'metadata';
    media.src = source.src;
    this.#set({ source: { ...source } });
    this.emit('source-change', { source: { ...source } });
    if (shouldPlay) this.#playMedia(true);
  }

  // Swaps the file for another quality where the video was, still playing if it was.
  #playFile(id, options) {
    const source = this.#files[id];
    if (!source) return;
    const media = this.media;
    const resume = options ?? { at: media.currentTime, play: !media.paused };
    this.#set({ activeQuality: id });
    if (this.#state.source?.src === source.src) return;
    if (!options) this.#set({ waiting: true });
    this.#setSource(source, resume);
  }

  // The smallest file that is as sharp as the player is tall on this screen.
  #autoFile() {
    const height = (this.#state.fullscreen ? screen.height : this.clientHeight || 360) * Math.min(devicePixelRatio || 1, 2);
    let pick = 0;
    this.#files.forEach((source, id) => {
      if (source.quality >= height * 0.9) pick = id;
    });
    return pick;
  }

  #closestFile(height) {
    let best = 0;
    this.#files.forEach((source, id) => {
      if (Math.abs(source.quality - height) < Math.abs(this.#files[best].quality - height)) best = id;
    });
    return best;
  }

  async #hlsClass() {
    const library = this.hlsLibrary ?? window.Hls;
    if (!library) return null;
    if (typeof library === 'function' && 'isSupported' in library) return library;
    const loaded = typeof library === 'function' ? await library() : await import(/* @vite-ignore */ String(library));
    return loaded?.default ?? loaded;
  }

  #attachHls(Hls, source) {
    const media = this.media;
    const hls = new Hls({ ...this.hlsConfig });
    this.#hls = hls;
    const { Events } = Hls;
    hls.on(Events.MANIFEST_PARSED, (_, data) => {
      this.#hlsLevels = data.levels ?? hls.levels;
      const qualities = this.#hlsLevels.map((level, id) => ({ id, height: level.height, label: level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)} kbps`, bitrate: level.bitrate })).filter((quality) => quality.height || quality.bitrate);
      this.#set({ qualities });
      const stored = this.#stored().quality;
      if (Number.isFinite(stored) && qualities.length > 1) {
        const id = qualities.reduce((best, quality) => (Math.abs(quality.height - stored) < Math.abs(best.height - stored) ? quality : best)).id;
        hls.currentLevel = id;
        this.#set({ quality: id });
      }
    });
    hls.on(Events.LEVEL_SWITCHED, (_, data) => this.#set({ activeQuality: data.level }));
    hls.on(Events.LEVEL_LOADED, (_, data) => this.#set({ live: Boolean(data.details?.live) }));
    hls.on(Events.AUDIO_TRACKS_UPDATED, () => this.#syncAudioTracks());
    hls.on(Events.AUDIO_TRACK_SWITCHED, () => this.#syncAudioTracks());
    let recovered = false;
    hls.on(Events.ERROR, (_, data) => {
      if (!data.fatal) return;
      // One recovery for each kind of trouble before giving up.
      if (!recovered && data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
      else if (!recovered && data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
      else {
        this.#fail(data.type === Hls.ErrorTypes.NETWORK_ERROR ? 2 : 3, data.details);
        return;
      }
      recovered = true;
    });
    hls.attachMedia(media);
    hls.loadSource(source.src);
    this.#files = [source];
    this.#set({ source: { ...source } });
    this.emit('source-change', { source: { ...source } });
  }

  #detachHls() {
    if (!this.#hls) return;
    this.#hls.destroy();
    this.#hls = null;
    this.#hlsLevels = [];
  }

  async #playMedia(autoplay = false) {
    const media = this.media;
    try {
      await media.play();
    } catch (error) {
      if (error.name === 'AbortError') return;
      // Browsers let a video play on its own only without sound.
      if (error.name === 'NotAllowedError' && autoplay && !media.muted) {
        media.muted = true;
        await media.play().catch(() => {});
        return;
      }
      if (!autoplay) throw error;
    }
  }

  #fail(code, detail = '') {
    const key = ERRORS[code] ?? 'errorDecode';
    const error = { code, message: this.#t(key), detail: String(detail || this.media.error?.message || '') };
    this.#set({ error, waiting: false });
    this.emit('error', error);
  }

  #retry() {
    const at = this.currentTime;
    this.#set({ error: null });
    this.#attached = true;
    this.#loadSource({ at, play: true });
  }

  // ---- Media events ----

  #bindMedia(media, options) {
    const on = (type, listener) => media.addEventListener(type, listener, options);
    const time = () => ({ currentTime: media.currentTime });
    on('loadstart', () => this.#set({ canPlay: false }));
    on('loadedmetadata', () => {
      const pending = this.#pending;
      this.#pending = null;
      this.#syncDuration();
      this.#set({ width: media.videoWidth, height: media.videoHeight });
      let at = pending?.at ?? 0;
      // Back where the viewer left off, unless that was the end.
      const stored = this.#stored().time;
      if (!at && stored?.src === this.#state.source?.src && stored.t < media.duration - 5) at = stored.t;
      if (at > 0) media.currentTime = at;
      this.#syncTextTracks();
      this.#syncAudioTracks();
      this.emit('loaded-metadata', { duration: media.duration, width: media.videoWidth, height: media.videoHeight });
    });
    on('durationchange', () => this.#syncDuration());
    on('resize', () => this.#set({ width: media.videoWidth, height: media.videoHeight }));
    on('canplay', () => {
      this.#set({ canPlay: true, waiting: false });
      this.emit('can-play');
    });
    on('play', () => {
      this.#set({ paused: false, ended: false });
      this.#claimSession();
      this.#loop();
      this.#showControls();
      this.emit('play');
    });
    on('playing', () => {
      this.#set({ playing: true, waiting: false, started: true });
      // Now that it has started, the controls may go once the pointer rests.
      this.#showControls();
      this.emit('playing');
    });
    on('pause', () => {
      this.#set({ paused: true, playing: false, waiting: false });
      this.#syncTime();
      this.#showControls();
      this.#saveTime(true);
      if (navigator.mediaSession && sessionOwner === this) navigator.mediaSession.playbackState = 'paused';
      this.emit('pause');
    });
    on('waiting', () => {
      this.#set({ waiting: true, playing: false });
      this.emit('waiting');
    });
    on('seeking', () => {
      this.#set({ seeking: true });
      this.emit('seeking', time());
    });
    on('seeked', () => {
      this.#set({ seeking: false });
      this.#syncTime();
      this.emit('seeked', time());
    });
    on('timeupdate', () => {
      this.#syncTime();
      this.#positionState();
      this.#saveTime();
      this.emit('time-update', time());
    });
    on('progress', () => this.#set({ bufferedEnd: this.#bufferedEnd() }));
    on('ended', () => {
      this.#set({ ended: true, paused: true, playing: false });
      this.#syncTime();
      this.#showControls();
      this.#save({ time: null });
      this.emit('ended');
    });
    on('volumechange', () => {
      this.setValue('volume', media.volume);
      this.setValue('muted', media.muted);
      this.#set({ volume: media.volume, muted: media.muted });
      this.#save({ volume: media.volume, muted: media.muted });
      this.emit('volume-change', { volume: media.volume, muted: media.muted });
    });
    on('ratechange', () => {
      this.setValue('playbackRate', media.playbackRate);
      this.#set({ playbackRate: media.playbackRate });
      this.#save({ playbackRate: media.playbackRate });
      this.#positionState();
      this.emit('rate-change', { playbackRate: media.playbackRate });
    });
    on('error', () => {
      if (!this.#hls) this.#fail(media.error?.code ?? 4);
    });
    on('enterpictureinpicture', () => this.#syncPip(true));
    on('leavepictureinpicture', () => this.#syncPip(false));
    on('webkitpresentationmodechanged', () => this.#syncPip(media.webkitPresentationMode === 'picture-in-picture'));
    // iPhone's own fullscreen draws its own captions.
    on('webkitbeginfullscreen', () => {
      this.#set({ fullscreen: true });
      if (this.#cueTrack) this.#cueTrack.mode = 'showing';
    });
    on('webkitendfullscreen', () => {
      this.#set({ fullscreen: false });
      if (this.#cueTrack) this.#cueTrack.mode = 'hidden';
    });
    media.textTracks.addEventListener('addtrack', () => this.#syncTextTracks(), options);
    media.textTracks.addEventListener('removetrack', () => this.#syncTextTracks(), options);
    media.audioTracks?.addEventListener('addtrack', () => this.#syncAudioTracks(), options);
    media.audioTracks?.addEventListener('change', () => this.#syncAudioTracks(), options);
    this.#set({ volume: media.volume, muted: media.muted, playbackRate: media.playbackRate });
  }

  #syncDuration() {
    const media = this.media;
    const live = media.duration === Number.POSITIVE_INFINITY || this.#state.live;
    const duration = Number.isFinite(media.duration) ? media.duration : 0;
    const chapters = this.#state.chapters;
    // The last chapter ends with the video.
    if (duration && chapters.some((chapter) => !Number.isFinite(chapter.end) || chapter.end > duration)) {
      this.#set({ chapters: chapters.map((chapter) => ({ ...chapter, end: Math.min(chapter.end, duration) })) });
    }
    this.#set({ duration, live });
    this.emit('duration-change', { duration });
  }

  // While it plays and can be seen, the position is read every frame, so the
  // timeline moves smoothly rather than four times a second.
  #loop() {
    if (this.#frame || this.media.paused || !this.#visible) return;
    const tick = () => {
      this.#frame = 0;
      this.#syncTime();
      if (!this.media.paused && this.#visible) this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }

  #syncTime() {
    const media = this.media;
    const seekable = media.seekable;
    const seekableStart = seekable.length ? seekable.start(0) : 0;
    const seekableEnd = seekable.length ? seekable.end(seekable.length - 1) : 0;
    const currentTime = media.currentTime;
    const liveEdge = this.#state.live && seekableEnd - currentTime < LIVE_TOLERANCE;
    const chapter = this.#chapterAt(currentTime);
    const changedChapter = chapter !== this.#state.chapter;
    this.#set({ currentTime, bufferedEnd: this.#bufferedEnd(), seekableStart, seekableEnd, liveEdge, chapter });
    if (changedChapter) this.emit('chapter-change', { chapter: this.#state.chapters[chapter] ?? null });
  }

  // Where the stretch of buffer the playhead is in ends.
  #bufferedEnd() {
    const { buffered, currentTime } = this.media;
    let end = 0;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime + 0.5 && buffered.end(i) >= currentTime) end = buffered.end(i);
    }
    return end;
  }

  #range() {
    const { live, seekableStart, seekableEnd, duration } = this.#state;
    return live ? { start: seekableStart, end: seekableEnd } : { start: 0, end: duration };
  }

  #chapterAt(time) {
    const chapters = this.#state.chapters;
    const index = itemAt(chapters, time);
    return index >= 0 && time < chapters[index].end ? index : -1;
  }

  #syncFullscreen() {
    const fullscreen = document.fullscreenElement === this || document.webkitFullscreenElement === this;
    if (fullscreen === this.#state.fullscreen) return;
    if (!fullscreen) screen.orientation?.unlock?.();
    this.#set({ fullscreen });
    this.emit('fullscreen-change', { fullscreen });
  }

  #syncPip(pictureInPicture) {
    this.#set({ pictureInPicture });
    this.emit('picture-in-picture-change', { pictureInPicture });
  }

  #syncAudioTracks() {
    const hls = this.#hls;
    if (hls) {
      const tracks = (hls.audioTracks ?? []).map((track, id) => ({ id, label: track.name || track.lang || `Track ${id + 1}`, language: track.lang ?? '' }));
      this.#set({ audioTracks: tracks, audioTrack: hls.audioTrack });
      return;
    }
    const list = this.media.audioTracks;
    if (!list) return;
    const tracks = [];
    let active = -1;
    for (let i = 0; i < list.length; i++) {
      tracks.push({ id: i, label: list[i].label || list[i].language || `Track ${i + 1}`, language: list[i].language ?? '' });
      if (list[i].enabled) active = i;
    }
    this.#set({ audioTracks: tracks, audioTrack: active });
  }

  // Casting through the Remote Playback API, or AirPlay on Apple devices.
  #watchRemote(options) {
    const media = this.media;
    if (media.webkitShowPlaybackTargetPicker && 'WebKitPlaybackTargetAvailabilityEvent' in window) {
      media.addEventListener('webkitplaybacktargetavailabilitychanged', (event) => this.#set({ canCast: event.availability === 'available' }), options);
      media.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', () => this.#set({ casting: media.webkitCurrentPlaybackTargetIsWireless ? 'connected' : 'disconnected' }), options);
      return;
    }
    const remote = media.remote;
    if (!remote?.watchAvailability) return;
    remote.watchAvailability((available) => this.#set({ canCast: available })).then(
      (id) => this.signal.addEventListener('abort', () => remote.cancelWatchAvailability(id).catch(() => {})),
      () => this.#set({ canCast: false }),
    );
    for (const type of ['connecting', 'connect', 'disconnect']) remote.addEventListener(type, () => this.#set({ casting: remote.state }), options);
  }

  // ---- Text tracks ----

  #trackList() {
    const children = [...this.querySelectorAll(':scope > track')].map((track) => ({ src: track.getAttribute('src'), kind: track.kind, label: track.label, language: track.srclang, default: track.default }));
    return [...(Array.isArray(this.tracks) ? this.tracks : []), ...children].filter((track) => track && (track.src || track.content));
  }

  // Each track is fetched and handed to the video as a same-origin WebVTT
  // file, so no CORS mode is needed on the video and SRT works too.
  // A load cut short by a disconnect runs again once the player is back:
  // at once when it already is by the time the abort lands, else on connecting.
  #interrupt(name, load) {
    if (this.isConnected) load();
    else this.#interrupted.set(name, load);
  }

  async #loadTracks() {
    const media = this.media;
    const list = this.#trackList();
    this.#lastTracks = JSON.stringify(list);
    const token = (this.#tracksToken += 1);
    const { signal } = this;
    for (const element of media.querySelectorAll('track')) element.remove();
    for (const url of this.#trackUrls) URL.revokeObjectURL(url);
    this.#trackUrls = [];
    this.#trackDefaults.clear();
    const loaded = await Promise.all(
      list.map(async (track) => {
        try {
          const text = track.content ?? (await fetchText(new URL(track.src, document.baseURI).href, signal));
          return { ...track, text: toVtt(text) };
        } catch (error) {
          if (signal.aborted) return null;
          console.warn(`lw-video-player: could not load the track "${track.label ?? track.src}".`, error);
          return null;
        }
      }),
    );
    if (token !== this.#tracksToken) return;
    if (signal.aborted) {
      this.#interrupt('tracks', () => this.#loadTracks());
      return;
    }
    for (const track of loaded) {
      if (!track) continue;
      const kind = track.kind || 'subtitles';
      if (kind === 'chapters') {
        if (!this.chapters) this.#set({ chapters: chaptersFromCues(parseCues(track.text)) });
        continue;
      }
      if (kind === 'metadata') continue;
      const url = URL.createObjectURL(new Blob([track.text], { type: 'text/vtt' }));
      this.#trackUrls.push(url);
      const element = Object.assign(document.createElement('track'), { kind, label: track.label ?? '', srclang: track.language ?? track.srclang ?? '', src: url });
      media.append(element);
      if (track.default) this.#trackDefaults.set(element.track, true);
    }
    this.#syncTextTracks();
  }

  // The captions menu lists every subtitle and caption track the video has,
  // from this player or from a stream.
  #syncTextTracks() {
    const media = this.media;
    const objects = [...media.textTracks].filter((track) => track.kind === 'subtitles' || track.kind === 'captions');
    const showing = objects.findIndex((track) => track.mode === 'showing');
    this.#trackObjects = objects;
    this.#set({ textTracks: objects.map((track, id) => ({ id, label: track.label || track.language || `Track ${id + 1}`, language: track.language, kind: track.kind })) });
    let index;
    if (this.#captionsChoice === undefined) {
      const stored = this.#stored().captions;
      if (stored === 'off') index = -1;
      else if (stored) index = objects.findIndex((track) => track.language === stored || track.label === stored);
      if (index === undefined || (index < 0 && stored !== 'off')) index = showing >= 0 ? showing : objects.findIndex((track) => this.#trackDefaults.has(track));
    } else {
      index = objects.indexOf(this.#cueTrack);
    }
    objects.forEach((track, i) => {
      track.mode = i === index ? 'hidden' : 'disabled';
    });
    if (index >= 0) this.#lastTrack = index;
    this.#watchCues(objects[index] ?? null);
    this.#set({ textTrack: index });
  }

  #preferredTrack() {
    const languages = navigator.languages ?? [navigator.language];
    for (const language of languages) {
      const index = this.#trackObjects.findIndex((track) => track.language && language.toLowerCase().startsWith(track.language.toLowerCase()));
      if (index >= 0) return index;
    }
    return 0;
  }

  #watchCues(track) {
    if (this.#cueTrack === track) {
      this.#renderCues();
      return;
    }
    this.#cueTrack?.removeEventListener('cuechange', this.#renderCues);
    this.#cueTrack = track;
    track?.addEventListener('cuechange', this.#renderCues);
    this.#renderCues();
  }

  // The active cues, each line on a box of its own; a cue placed by its
  // `line` keeps that place.
  #renderCues = () => {
    const box = this.query('.cue-layer');
    const cues = this.#cueTrack ? [...(this.#cueTrack.activeCues ?? [])] : [];
    box.replaceChildren(
      ...cues.map((cue) => {
        const line = Object.assign(document.createElement('div'), { className: 'cue' });
        const text = Object.assign(document.createElement('span'), { className: 'cue-text' });
        text.append(typeof cue.getCueAsHTML === 'function' ? cue.getCueAsHTML() : document.createTextNode(cue.text));
        line.append(text);
        if (cue.align === 'start' || cue.align === 'left') line.dataset.align = 'start';
        if (cue.align === 'end' || cue.align === 'right') line.dataset.align = 'end';
        if (cue.snapToLines === false && typeof cue.line === 'number') {
          line.dataset.placed = '';
          line.style.top = `${clamp(cue.line, 0, 100)}%`;
        }
        return line;
      }),
    );
  };

  #paintCaptionStyle() {
    const pick = (group) => CAPTION_STYLES[group].find(([id]) => id === this.#captionStyle[group]) ?? CAPTION_STYLES[group][0];
    this.style.setProperty('--_cue-scale', String(pick('size')[2]));
    this.style.setProperty('--_cue-color', pick('color')[2]);
    this.style.setProperty('--_cue-background', String(pick('background')[2]));
    this.style.setProperty('--_cue-shadow', pick('edge')[2]);
  }

  #setCaptionStyle(patch) {
    this.#captionStyle = { ...this.#captionStyle, ...patch };
    this.#paintCaptionStyle();
    this.#save({ captionStyle: this.#captionStyle });
  }

  // ---- Chapters and thumbnails ----

  async #loadChapters() {
    const token = (this.#chaptersToken += 1);
    const { signal } = this;
    const { list, url } = listOrUrl(this.chapters);
    let chapters = normalizeChapters(list);
    if (url) {
      try {
        chapters = chaptersFromCues(parseCues(await fetchText(new URL(url, document.baseURI).href, signal)));
      } catch (error) {
        if (!signal.aborted) console.warn('lw-video-player: could not load the chapters.', error);
        chapters = [];
      }
    }
    if (token !== this.#chaptersToken) return;
    if (signal.aborted) {
      this.#interrupt('chapters', () => this.#loadChapters());
      return;
    }
    const duration = this.#state.duration;
    this.#set({ chapters: duration ? chapters.map((chapter) => ({ ...chapter, end: Math.min(chapter.end, duration) })) : chapters });
    this.#set({ chapter: this.#chapterAt(this.currentTime) });
  }

  async #loadThumbnails() {
    const token = (this.#thumbsToken += 1);
    const { signal } = this;
    const { list, url } = listOrUrl(this.thumbnails);
    let thumbs = normalizeThumbnails(list);
    if (url) {
      try {
        const href = new URL(url, document.baseURI).href;
        thumbs = thumbnailsFromCues(parseCues(await fetchText(href, signal)), href);
      } catch (error) {
        if (!signal.aborted) console.warn('lw-video-player: could not load the thumbnails.', error);
        thumbs = [];
      }
    }
    if (token !== this.#thumbsToken) return;
    if (signal.aborted) {
      this.#interrupt('thumbnails', () => this.#loadThumbnails());
      return;
    }
    this.#thumbs = thumbs;
    this.toggleAttribute('data-thumbnails', thumbs.length > 0);
    // The sprite sheets load ahead, so the first preview is not blank.
    for (const href of [...new Set(thumbs.map((thumb) => thumb.url))].slice(0, 12)) new Image().src = href;
    this.#chapterMenu.refresh();
  }

  #thumbAt(time) {
    return this.#thumbs[itemAt(this.#thumbs, time)] ?? null;
  }

  // A tile of a sprite sheet, or a whole image, scaled to `width`.
  #thumbStyle(thumb, width) {
    const scale = thumb.width ? width / thumb.width : 1;
    const height = thumb.height ? thumb.height * scale : (width * 9) / 16;
    const image = thumb.width ? `width: ${thumb.width}px; height: ${thumb.height}px; object-fit: none; object-position: ${-thumb.x}px ${-thumb.y}px; scale: ${scale}` : 'width: 100%; height: 100%; object-fit: cover';
    return { frame: `width: ${width}px; height: ${height}px`, image };
  }

  // ---- Layout ----

  #measure() {
    const { clientWidth: width, clientHeight: height } = this;
    const layout = width < SMALL_WIDTH || height < SMALL_HEIGHT ? 'sm' : 'lg';
    const bar = this.query('.bar.bottom');
    this.style.setProperty('--_bar-height', `${bar.offsetHeight}px`);
    // Menus open above the controls, or as a sheet over most of a small player.
    this.style.setProperty('--_menu-room', `${Math.max(120, layout === 'sm' ? Math.round(height * 0.85) - 16 : height - bar.offsetHeight - 32)}px`);
    if (layout !== this.#state.layout) {
      this.#set({ layout });
      this.#settings.close();
      this.#chapterMenu.close();
      this.#arrange(layout);
    }
  }

  #arrange(layout = this.#state.layout) {
    this.dataset.layout = layout;
    const pool = this.query('.pool');
    // Controls inside another, like mute in the volume group, move with it.
    const controls = new Map([...this.shadowRoot.querySelectorAll('[data-control]')].filter((element) => !element.parentElement.closest('[data-control]')).map((element) => [element.dataset.control, element]));
    for (const [group, names] of Object.entries(LAYOUTS[layout])) {
      const container = this.query(`[data-group="${group}"]`);
      container.replaceChildren(...names.map((name) => controls.get(name)));
    }
    for (const [name, element] of controls) if (!Object.values(LAYOUTS[layout]).some((names) => names.includes(name))) pool.append(element);
  }

  // ---- Controls ----

  #bindControls(options) {
    const on = (selector, listener) => this.query(selector).addEventListener('click', listener, options);
    on('.control.play', () => this.#act('togglePaused', 'button'));
    on('.start', () => this.#act('togglePaused', 'button'));
    on('.control.backward', () => this.#act('jumpBackward', 'button'));
    on('.control.forward', () => this.#act('jumpForward', 'button'));
    on('.control.mute', () => this.#act('toggleMuted', 'button'));
    on('.control.captions', () => this.#act('toggleCaptions', 'button'));
    on('.control.pip', () => this.#act('togglePictureInPicture', 'button'));
    on('.control.fullscreen', () => this.#act('toggleFullscreen', 'button'));
    on('.control.cast', () => this.requestCast());
    on('.live', () => this.seekToLiveEdge());
    on('.retry', () => this.#retry());
    on('.time', () => {
      this.#remaining = !this.#remaining;
      this.#shownSecond = '';
      this.#paintTime();
    });
    on('.menu-scrim', () => {
      this.#settings.close();
      this.#chapterMenu.close();
    });

    // The controls stay while the pointer is on them or a key moved focus there.
    for (const bar of this.shadowRoot.querySelectorAll('.bar, .center')) {
      bar.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse') return;
        this.#overControls = true;
        this.#showControls();
      }, options);
      bar.addEventListener('pointerleave', () => {
        this.#overControls = false;
        this.#showControls();
      }, options);
    }
    this.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse') this.#showControls();
    }, options);
    this.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.#overControls = false;
      this.hideControls();
    }, options);
    this.addEventListener('focusin', (event) => {
      const target = event.composedPath()[0];
      this.#focusVisible = target instanceof Element && target.matches(':focus-visible') && target !== this;
      if (this.#focusVisible) this.#showControls();
    }, options);
    this.addEventListener('focusout', () => {
      this.#focusVisible = false;
      this.#showControls();
    }, options);
  }

  #setControls(visible) {
    if (visible === this.#state.controlsVisible) return;
    this.#set({ controlsVisible: visible });
    if (!visible) this.#hideTip();
    this.emit('controls-change', { visible });
  }

  #showControls(delay = this.hideDelay) {
    this.#setControls(true);
    clearTimeout(this.#hideTimer);
    if (this.#canHide()) this.#hideTimer = setTimeout(() => this.#canHide() && this.#setControls(false), delay);
  }

  #canHide() {
    const { paused, menu, error, started } = this.#state;
    return !paused && started && !menu && !error && !this.#scrubbing && !this.#overControls && !this.#focusVisible;
  }

  #menuToggled(name, open) {
    if (open) {
      (name === 'settings' ? this.#chapterMenu : this.#settings).close();
      this.#hideTip();
    }
    this.#set({ menu: open ? name : this.#state.menu === name ? null : this.#state.menu });
    this.#showControls();
  }

  // ---- Gestures ----

  // A mouse click plays or pauses, a double click goes fullscreen. A tap
  // shows or hides the controls; a double tap on either side seeks, and
  // every tap after it in a row seeks again.
  #bindGestures(options) {
    const layer = this.query('.gestures');
    let pointer = 'mouse';
    layer.addEventListener('pointerdown', (event) => {
      pointer = event.pointerType;
      this.#press = { x: event.clientX, y: event.clientY, menu: Boolean(this.#state.menu) };
      this.focus({ preventScroll: true });
    }, options);
    layer.addEventListener('pointerup', (event) => {
      const press = this.#press;
      this.#press = null;
      if (!press || press.menu || Math.hypot(event.clientX - press.x, event.clientY - press.y) > 12) return;
      if (event.pointerType === 'mouse') {
        if (event.button === 0) this.#act('togglePaused', 'gesture');
      } else this.#tap(event);
    }, options);
    layer.addEventListener('dblclick', () => pointer === 'mouse' && !this.#state.menu && this.#act('toggleFullscreen', 'gesture'), options);
    layer.addEventListener('contextmenu', (event) => event.pointerType === 'touch' && event.preventDefault(), options);
  }

  #tap(event) {
    const box = this.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const zone = x < 0.35 ? -1 : x > 0.65 ? 1 : 0;
    const now = performance.now();
    const taps = this.#taps;
    const inSeries = taps.series && now - taps.series < TAP_SERIES && zone === taps.zone;
    const double = now - taps.time < DOUBLE_TAP && zone === taps.zone;
    if (zone !== 0 && (inSeries || double)) {
      // The first tap toggled the controls; the double tap takes that back.
      if (double && !inSeries) {
        if (taps.wasVisible) this.#showControls();
        else this.#setControls(false);
      }
      this.seekBy(zone * this.seekStep);
      this.#showRipple(zone, this.seekStep);
      taps.series = now;
      taps.time = 0;
      return;
    }
    taps.series = 0;
    taps.time = now;
    taps.zone = zone;
    taps.wasVisible = this.#state.controlsVisible;
    if (this.#state.controlsVisible && this.#state.started && !this.#state.paused) this.hideControls();
    else this.#showControls();
  }

  // ---- Sliders ----

  #bindSliders(options) {
    const timeline = this.query('.timeline');
    const at = (event) => {
      const box = timeline.querySelector('.segments').getBoundingClientRect();
      const { start, end } = this.#range();
      return start + clamp((event.clientX - box.left) / box.width, 0, 1) * (end - start);
    };
    timeline.addEventListener('pointerdown', (event) => {
      const { start, end } = this.#range();
      if ((event.pointerType === 'mouse' && event.button !== 0) || !(end > start)) return;
      timeline.setPointerCapture(event.pointerId);
      this.#scrubbing = true;
      this.toggleAttribute('data-scrubbing', true);
      this.#scrubTo(at(event));
      this.#preview(this.#scrub);
      this.#showControls();
    }, options);
    timeline.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse' || this.#scrubbing) {
        this.#hoverTime = at(event);
        this.#preview(this.#hoverTime);
      }
      if (this.#scrubbing) this.#scrubTo(at(event));
    }, options);
    const release = (event) => {
      if (!this.#scrubbing) return;
      this.#scrubbing = false;
      this.removeAttribute('data-scrubbing');
      clearTimeout(this.#seekTimer);
      if (this.#scrub != null) this.seek(this.#scrub);
      this.#scrub = null;
      if (event.pointerType !== 'mouse' || !timeline.matches(':hover')) this.#endPreview();
      this.#showControls();
    };
    timeline.addEventListener('pointerup', release, options);
    timeline.addEventListener('pointercancel', release, options);
    timeline.addEventListener('lostpointercapture', release, options);
    timeline.addEventListener('pointerleave', () => !this.#scrubbing && this.#endPreview(), options);
    timeline.addEventListener('keydown', (event) => {
      const { start, end } = this.#range();
      const moves = { ArrowLeft: -KEY_STEP, ArrowDown: -KEY_STEP, ArrowRight: KEY_STEP, ArrowUp: KEY_STEP, PageDown: -(end - start) / 10, PageUp: (end - start) / 10 };
      let time;
      if (event.key in moves) time = (this.#scrub ?? this.currentTime) + moves[event.key];
      else if (event.key === 'Home') time = start;
      else if (event.key === 'End') time = end;
      else return;
      event.preventDefault();
      event.stopPropagation();
      this.seek(time);
      this.#preview(clamp(time, start, end), true);
    }, options);
    timeline.addEventListener('blur', () => this.#endPreview(), options);

    const volume = this.query('.volume-slider');
    const level = (event) => {
      const box = volume.querySelector('.rail').getBoundingClientRect();
      return clamp((event.clientX - box.left) / box.width, 0, 1);
    };
    let dragging = false;
    volume.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      volume.setPointerCapture(event.pointerId);
      dragging = true;
      volume.closest('.volume').toggleAttribute('data-active', true);
      this.#setVolume(level(event));
    }, options);
    volume.addEventListener('pointermove', (event) => dragging && this.#setVolume(level(event)), options);
    const stop = () => {
      dragging = false;
      volume.closest('.volume').removeAttribute('data-active');
    };
    volume.addEventListener('pointerup', stop, options);
    volume.addEventListener('lostpointercapture', stop, options);
    volume.addEventListener('keydown', (event) => {
      const now = this.#state.muted ? 0 : this.#state.volume;
      const moves = { ArrowLeft: -VOLUME_STEP, ArrowDown: -VOLUME_STEP, ArrowRight: VOLUME_STEP, ArrowUp: VOLUME_STEP, PageDown: -0.1, PageUp: 0.1 };
      if (event.key in moves) this.#setVolume(now + moves[event.key]);
      else if (event.key === 'Home') this.#setVolume(0);
      else if (event.key === 'End') this.#setVolume(1);
      else return;
      event.preventDefault();
      event.stopPropagation();
    }, options);
  }

  #scrubTo(time) {
    this.#scrub = time;
    this.#paintTimeline();
    // The media follows, a few times a second, on keyframes where it can.
    const media = this.media;
    const go = () => {
      this.#lastSeek = performance.now();
      if (this.#scrub == null) return;
      if (media.fastSeek && this.#scrubbing) media.fastSeek(this.#scrub);
      else media.currentTime = this.#scrub;
    };
    clearTimeout(this.#seekTimer);
    const wait = SEEK_THROTTLE - (performance.now() - this.#lastSeek);
    if (wait <= 0) go();
    else this.#seekTimer = setTimeout(go, wait);
  }

  #setVolume(value) {
    const media = this.media;
    media.volume = clamp(Math.round(value * 100) / 100, 0, 1);
    media.muted = media.volume === 0;
  }

  // The frame, chapter and time under the pointer, above it and kept inside
  // the player.
  #preview(time, keyboard = false) {
    const timeline = this.query('.timeline');
    const preview = this.query('.preview');
    const { start, end } = this.#range();
    if (!(end > start)) return;
    const thumb = this.#thumbAt(time);
    const frame = preview.querySelector('.frame');
    frame.hidden = !thumb;
    if (thumb) {
      const width = this.#state.layout === 'sm' ? 128 : Math.min(192, Math.round((thumb.width ?? 180) * 1.1));
      const { frame: box, image } = this.#thumbStyle(thumb, width);
      frame.style.cssText = box;
      const img = frame.querySelector('img');
      if (img.getAttribute('src') !== thumb.url) img.src = thumb.url;
      img.style.cssText = image;
    }
    const chapter = this.#state.chapters[this.#chapterAt(time)];
    preview.querySelector('.preview-chapter').textContent = chapter?.title ?? '';
    preview.querySelector('.preview-time').textContent = this.#state.live ? `-${clock(end - time)}` : clock(time, end >= 3600);
    const box = timeline.querySelector('.segments').getBoundingClientRect();
    const host = this.getBoundingClientRect();
    const x = box.left + ((time - start) / (end - start)) * box.width;
    const half = preview.offsetWidth / 2;
    const left = clamp(x, host.left + 8 + half, host.right - 8 - half) - timeline.getBoundingClientRect().left;
    preview.style.left = `${left}px`;
    timeline.toggleAttribute('data-previewing', true);
    this.#hoverTime = time;
    this.#paintHover();
    clearTimeout(this.#previewTimer);
    if (keyboard) this.#previewTimer = setTimeout(() => this.#endPreview(), 900);
  }

  #endPreview() {
    this.query('.timeline').removeAttribute('data-previewing');
    this.#hoverTime = null;
    this.#paintHover();
  }

  // ---- Keyboard ----

  #bindKeyboard() {
    if (!this.isConnected) return;
    const target = this.keyboard === 'document' ? document : this.keyboard === 'off' ? null : this;
    if (this.#keyTarget && !this.#keyTarget.abort.signal.aborted && target === this.#keyTarget.target) return;
    this.#keyTarget?.abort.abort();
    this.#keyTarget = null;
    if (!target) return;
    const abort = new AbortController();
    this.signal.addEventListener('abort', () => abort.abort());
    target.addEventListener('keydown', (event) => this.#onKey(event), { signal: abort.signal });
    this.#keyTarget = { target, abort };
  }

  #onKey(event) {
    if (event.defaultPrevented || isTyping(event)) return;
    const origin = event.composedPath()[0];
    // Space and Enter belong to the button or menu item in focus.
    if ((event.key === ' ' || event.key === 'Enter') && origin instanceof Element && origin.matches('button, [role^="menuitem"], a')) return;
    // Another player on the page keeps its own keys.
    if (this.keyboard === 'document' && event.composedPath().some((node) => node instanceof LwVideoPlayer && node !== this)) return;
    const pressed = event.key === ' ' ? 'Space' : event.key;
    for (const [action, tokens] of this.#keys) {
      const token = tokens.find((candidate) => this.#matches(event, pressed, candidate));
      if (!token) continue;
      event.preventDefault();
      this.#act(action, 'keyboard', token);
      return;
    }
  }

  #matches(event, pressed, token) {
    const parts = token.split('+');
    const key = parts.pop();
    const modifiers = new Set(parts.map((part) => part.toLowerCase()));
    if (event.ctrlKey !== modifiers.has('ctrl') || event.altKey !== modifiers.has('alt') || event.metaKey !== (modifiers.has('meta') || modifiers.has('cmd'))) return false;
    if (modifiers.has('shift') && !event.shiftKey) return false;
    return key.length === 1 ? pressed.toLowerCase() === key.toLowerCase() : pressed === key;
  }

  // Every action from a button, a gesture or a key, with what it shows:
  // keys and gestures flash an icon or a ripple and say what they did.
  async #act(action, from, token = '') {
    const media = this.media;
    const feedback = from !== 'button';
    const step = (seconds) => {
      this.seekBy(seconds);
      if (feedback) this.#showRipple(Math.sign(seconds), Math.abs(seconds));
      this.#showControls();
    };
    switch (action) {
      case 'togglePaused': {
        const wasPaused = media.paused;
        if (wasPaused) this.play().catch(() => {});
        else this.pause();
        if (feedback && this.#state.started) this.#flash(wasPaused ? play : pause, '', true);
        if (from === 'keyboard') this.#announce(this.#t(wasPaused ? 'playing' : 'paused'));
        break;
      }
      case 'seekBackward':
        step(-KEY_STEP);
        break;
      case 'seekForward':
        step(KEY_STEP);
        break;
      case 'jumpBackward':
        step(-this.seekStep);
        break;
      case 'jumpForward':
        step(this.seekStep);
        break;
      case 'volumeUp':
      case 'volumeDown': {
        this.#setVolume((media.muted ? 0 : media.volume) + (action === 'volumeUp' ? VOLUME_STEP : -VOLUME_STEP));
        const percent = Math.round(media.volume * 100);
        this.#flash(media.muted ? volumeX : media.volume < 0.5 ? volume1 : volume2, `${percent}%`);
        this.#announce(this.#t('volumeLevel', { n: percent }));
        break;
      }
      case 'toggleMuted': {
        // Unmuted at no volume, it comes back at a quarter.
        if (media.muted || media.volume === 0) {
          if (media.volume === 0) media.volume = 0.25;
          media.muted = false;
        } else media.muted = true;
        if (feedback) this.#flash(media.muted ? volumeX : volume2);
        if (from === 'keyboard') this.#announce(media.muted ? this.#t('muted') : this.#t('volumeLevel', { n: Math.round(media.volume * 100) }));
        break;
      }
      case 'toggleCaptions': {
        if (!this.#trackObjects.length) return;
        this.toggleCaptions();
        const track = this.#state.textTracks[this.#state.textTrack];
        if (feedback) this.#flash(captions, track ? track.label : this.#t('off'));
        if (from === 'keyboard') this.#announce(track ? this.#t('captionsShown', { n: track.label }) : this.#t('captionsHidden'));
        break;
      }
      case 'toggleFullscreen':
        if (!this.#state.canFullscreen) return;
        this.toggleFullscreen().catch(() => {});
        break;
      case 'togglePictureInPicture':
        if (!this.#state.canPictureInPicture) return;
        this.togglePictureInPicture().catch(() => {});
        break;
      case 'speedUp':
      case 'speedDown': {
        const speeds = this.#speeds();
        const index = speeds.findIndex((rate) => rate >= media.playbackRate - 0.001);
        const next = speeds[clamp((index < 0 ? speeds.length - 1 : index) + (action === 'speedUp' ? 1 : -1), 0, speeds.length - 1)];
        this.playbackRate = next;
        this.#flash(gauge, `${next}×`);
        this.#announce(this.#t('speedLevel', { n: `${next}×` }));
        break;
      }
      case 'previousFrame':
      case 'nextFrame':
        if (!media.paused) return;
        this.seekBy(action === 'nextFrame' ? FRAME : -FRAME);
        break;
      case 'seekToStart':
        this.seek(this.#range().start);
        this.#showControls();
        break;
      case 'seekToEnd':
        this.seek(this.#range().end);
        this.#showControls();
        break;
      case 'seekToPercent': {
        const { start, end } = this.#range();
        this.seek(start + ((end - start) * Number(token)) / 10);
        this.#showControls();
        break;
      }
      default:
    }
  }

  #speeds() {
    const list = Array.isArray(this.speeds) && this.speeds.length ? this.speeds : SPEEDS;
    return [...new Set(list.map(Number).filter((rate) => rate > 0))].sort((a, b) => a - b);
  }

  #flash(inner, text = '', solid = false) {
    const bezel = this.query('.bezel');
    bezel.toggleAttribute('data-solid', solid);
    bezel.querySelector('.bezel-icon').innerHTML = strokeIcon(inner, 24);
    bezel.querySelector('.bezel-text').textContent = text;
    bezel.toggleAttribute('data-text', Boolean(text));
    for (const animation of bezel.getAnimations()) animation.cancel();
    const frames = reducedMotion.matches
      ? [{ opacity: 1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }]
      : [{ opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, offset: 0.18 }, { opacity: 1, scale: 1, offset: 0.55 }, { opacity: 0, scale: 1.06 }];
    bezel.animate(frames, { duration: text ? 900 : 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  }

  // A seek from the keyboard or a double tap: a ripple on that side with
  // chevrons and the seconds, adding up while seeks follow each other.
  #showRipple(side, seconds) {
    const ripple = this.#ripple;
    if (ripple.side !== side) ripple.total = 0;
    ripple.side = side;
    ripple.total += seconds;
    clearTimeout(ripple.timer);
    ripple.timer = setTimeout(() => {
      ripple.total = 0;
      ripple.side = 0;
    }, 900);
    const element = this.query(`.ripple[data-side="${side}"]`);
    const other = this.query(`.ripple[data-side="${-side}"]`);
    for (const animation of other.getAnimations()) animation.cancel();
    element.querySelector('.ripple-text').textContent = this.#t('seconds', { n: Math.round(ripple.total * 10) / 10 });
    for (const animation of element.getAnimations()) animation.cancel();
    element.animate([{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], { duration: 900, easing: 'ease-out' });
    if (!reducedMotion.matches) {
      element.querySelectorAll('.chevrons i').forEach((chevron, i) => {
        chevron.animate([{ opacity: 0.25 }, { opacity: 1 }, { opacity: 0.25 }], { duration: 540, delay: (side > 0 ? i : 2 - i) * 110, easing: 'ease-in-out' });
      });
    }
  }

  #announce(text) {
    const announcer = this.query('.announcer');
    announcer.textContent = '';
    requestAnimationFrame(() => (announcer.textContent = text));
  }

  // ---- Tooltips ----

  // A label and its key over each button, quick to follow from one button
  // to the next once one has shown.
  #bindTooltips(options) {
    const root = this.shadowRoot;
    root.addEventListener('pointerover', (event) => {
      if (event.pointerType !== 'mouse') return;
      const control = event.target.closest?.('.control, .live, .time');
      if (!control) return;
      clearTimeout(this.#tipTimer);
      const warm = performance.now() - this.#tipWarm < 400;
      this.#tipTimer = setTimeout(() => this.#showTip(control), warm ? 0 : 500);
    }, options);
    root.addEventListener('pointerout', (event) => {
      if (!event.target.closest?.('.control, .live, .time')) return;
      clearTimeout(this.#tipTimer);
      this.#hideTip();
    }, options);
    root.addEventListener('focusin', (event) => {
      const control = event.target.closest?.('.control, .live, .time');
      if (control?.matches(':focus-visible')) this.#showTip(control);
    }, options);
    root.addEventListener('focusout', () => this.#hideTip(), options);
    root.addEventListener('pointerdown', () => {
      clearTimeout(this.#tipTimer);
      this.#hideTip();
    }, options);
  }

  #showTip(control) {
    if (!control.isConnected || control.closest('.pool') || control.ariaExpanded === 'true' || !this.#state.controlsVisible) return;
    const tip = this.query('.tooltip');
    tip.querySelector('.tooltip-text').textContent = control.dataset.tip ?? control.ariaLabel ?? '';
    const key = control.dataset.key ?? '';
    tip.querySelector('kbd').textContent = key;
    tip.querySelector('kbd').hidden = !key;
    tip.toggleAttribute('data-shown', true);
    const host = this.getBoundingClientRect();
    const box = control.getBoundingClientRect();
    const below = Boolean(control.closest('.bar.top'));
    const half = tip.offsetWidth / 2;
    const x = clamp(box.left + box.width / 2 - host.left, 8 + half, host.width - 8 - half);
    tip.style.left = `${x}px`;
    tip.style.top = below ? `${box.bottom - host.top + 6}px` : `${box.top - host.top - 6 - tip.offsetHeight}px`;
    tip.dataset.side = below ? 'bottom' : 'top';
    this.#tipControl = control;
  }

  #hideTip() {
    const tip = this.query('.tooltip');
    if (tip.hasAttribute('data-shown')) this.#tipWarm = performance.now();
    tip.removeAttribute('data-shown');
    this.#tipControl = null;
  }

  // ---- Menus ----

  #settingsPage(id) {
    const state = this.#state;
    const svg = (inner) => strokeIcon(inner, 18);
    const speedLabel = (rate) => (rate === 1 ? this.#t('normal') : `${rate}×`);
    const qualities = [...state.qualities].sort((a, b) => b.height - a.height || b.bitrate - a.bitrate);
    const active = state.qualities.find((quality) => quality.id === state.activeQuality);
    const track = state.textTracks[state.textTrack];
    const audio = state.audioTracks.find((item) => item.id === state.audioTrack);
    if (id === 'root') {
      return {
        title: this.#t('settings'),
        items: [
          { type: 'submenu', page: 'speed', icon: svg(gauge), label: this.#t('speed'), hint: speedLabel(state.playbackRate) },
          state.qualities.length > 1 && { type: 'submenu', page: 'quality', icon: svg(slidersHorizontal), label: this.#t('quality'), hint: state.quality === 'auto' ? `${this.#t('auto')}${active ? ` · ${active.label}` : ''}` : (active?.label ?? '') },
          state.textTracks.length > 0 && { type: 'submenu', page: 'captions', icon: svg(captions), label: this.#t('captions'), hint: track?.label ?? this.#t('off') },
          state.textTracks.length > 0 && { type: 'submenu', page: 'style', icon: svg(type), label: this.#t('captionStyle') },
          state.audioTracks.length > 1 && { type: 'submenu', page: 'audio', icon: svg(audioLines), label: this.#t('audio'), hint: audio?.label ?? '' },
          { type: 'toggle', icon: svg(repeat), label: this.#t('loop'), checked: state.loop, onSelect: () => (this.loop = !this.loop) },
        ].filter(Boolean),
      };
    }
    if (id === 'speed') {
      return { title: this.#t('speed'), items: this.#speeds().map((rate) => ({ type: 'radio', label: speedLabel(rate), checked: Math.abs(rate - state.playbackRate) < 0.001, onSelect: () => (this.playbackRate = rate) })) };
    }
    if (id === 'quality') {
      const badge = (height) => (height >= 2160 ? '4K' : height >= 720 ? 'HD' : '');
      return {
        title: this.#t('quality'),
        items: [
          { type: 'radio', label: this.#t('auto'), hint: state.quality === 'auto' && active ? active.label : '', checked: state.quality === 'auto', onSelect: () => this.setQuality('auto') },
          ...qualities.map((quality) => ({ type: 'radio', label: quality.label, hint: badge(quality.height), checked: state.quality === quality.id, onSelect: () => this.setQuality(quality.id) })),
        ],
      };
    }
    if (id === 'captions') {
      return {
        title: this.#t('captions'),
        items: [
          { type: 'radio', label: this.#t('off'), checked: state.textTrack < 0, onSelect: () => this.setTextTrack(-1) },
          ...state.textTracks.map((item) => ({ type: 'radio', label: item.label, hint: item.label !== item.language ? (item.language ?? '').toUpperCase() : '', checked: state.textTrack === item.id, onSelect: () => this.setTextTrack(item.id) })),
        ],
      };
    }
    if (id === 'audio') {
      return { title: this.#t('audio'), items: state.audioTracks.map((item) => ({ type: 'radio', label: item.label, checked: state.audioTrack === item.id, onSelect: () => this.setAudioTrack(item.id) })) };
    }
    if (id === 'style') {
      const current = (group) => this.#t(CAPTION_STYLES[group].find(([option]) => option === this.#captionStyle[group])?.[1] ?? '');
      return {
        title: this.#t('captionStyle'),
        items: [
          ...Object.entries(STYLE_PAGES).map(([group, label]) => ({ type: 'submenu', page: `style-${group}`, label: this.#t(label), hint: current(group) })),
          { type: 'action', label: this.#t('reset'), stay: true, disabled: Object.entries(DEFAULT_STYLE).every(([group, value]) => this.#captionStyle[group] === value), onSelect: () => this.#setCaptionStyle(DEFAULT_STYLE) },
        ],
      };
    }
    const group = id.replace('style-', '');
    if (CAPTION_STYLES[group]) {
      return { title: this.#t(STYLE_PAGES[group]), items: CAPTION_STYLES[group].map(([option, label]) => ({ type: 'radio', label: this.#t(label), checked: this.#captionStyle[group] === option, onSelect: () => this.#setCaptionStyle({ [group]: option }) })) };
    }
    return { title: '', items: [] };
  }

  #chaptersPage() {
    const { chapters, chapter: current, duration } = this.#state;
    const hours = duration >= 3600;
    return {
      title: this.#t('chapters'),
      items: chapters.map((chapter, i) => {
        const thumb = this.#thumbAt(chapter.start + 0.5);
        let media = '';
        if (thumb) {
          const { frame, image } = this.#thumbStyle(thumb, 72);
          media = `<span class="item-thumb" style="${frame}"><img alt="" src="${escapeHtml(thumb.url)}" style="${image}"></span>`;
        }
        const length = Number.isFinite(chapter.end) ? chapter.end - chapter.start : 0;
        return {
          type: 'chapter',
          label: chapter.title,
          hint: clock(chapter.start, hours),
          detail: length ? clock(length) : '',
          media,
          checked: i === current,
          progress: i === current && length ? clamp((this.currentTime - chapter.start) / length, 0, 1) : null,
          onSelect: () => this.seek(chapter.start),
        };
      }),
    };
  }

  // ---- Painting ----

  #paint(changed) {
    const state = this.#state;
    const has = (...keys) => keys.some((key) => changed.has(key));
    const flags = { paused: state.paused, playing: state.playing, started: state.started, ended: state.ended, waiting: state.waiting, seeking: state.seeking, live: state.live, 'live-edge': state.liveEdge, fullscreen: state.fullscreen, pip: state.pictureInPicture, captions: state.textTrack >= 0, error: Boolean(state.error), controls: state.controlsVisible, menu: Boolean(state.menu), 'can-play': state.canPlay };
    for (const [name, value] of Object.entries(flags)) this.toggleAttribute(`data-${name}`, value);
    this.toggleAttribute('data-dvr', state.live && state.seekableEnd - state.seekableStart > DVR_WINDOW);

    if (has('paused', 'ended')) this.#paintPlay();
    if (has('volume', 'muted')) this.#paintVolume();
    if (has('currentTime', 'duration', 'bufferedEnd', 'seekableStart', 'seekableEnd', 'live')) {
      this.#paintTimeline();
      this.#paintTime();
      this.#paintChapterProgress();
    }
    if (has('chapters', 'duration', 'live')) this.#paintSegments();
    if (has('chapter', 'chapters')) {
      const chapter = state.chapters[state.chapter];
      const title = this.query('.chapter-title');
      title.textContent = chapter?.title ?? '';
      title.hidden = !chapter;
    }
    if (has('textTracks', 'textTrack')) {
      const button = this.query('.control.captions');
      button.hidden = state.textTracks.length === 0;
      button.ariaPressed = String(state.textTrack >= 0);
      button.ariaLabel = this.#t(state.textTrack >= 0 ? 'captionsOff' : 'captionsOn');
    }
    if (has('chapters')) this.query('.control.chapters').hidden = state.chapters.length === 0;
    if (has('fullscreen', 'canFullscreen')) {
      const button = this.query('.control.fullscreen');
      button.hidden = !state.canFullscreen;
      button.ariaLabel = this.#t(state.fullscreen ? 'exitFullscreen' : 'enterFullscreen');
    }
    if (has('pictureInPicture', 'canPictureInPicture')) {
      const button = this.query('.control.pip');
      button.hidden = !state.canPictureInPicture;
      button.ariaPressed = String(state.pictureInPicture);
      button.ariaLabel = this.#t(state.pictureInPicture ? 'exitPip' : 'enterPip');
    }
    if (has('canCast', 'casting')) {
      const button = this.query('.control.cast');
      button.hidden = !state.canCast;
      button.toggleAttribute('data-connected', state.casting === 'connected');
    }
    if (has('live', 'liveEdge')) {
      const live = this.query('.live');
      live.hidden = !state.live;
      live.ariaLabel = state.liveEdge ? this.#t('live') : this.#t('goLive');
      live.disabled = state.liveEdge;
    }
    if (has('error')) this.#paintError();
    if (has('playbackRate', 'quality', 'qualities', 'activeQuality', 'textTracks', 'textTrack', 'audioTracks', 'audioTrack', 'loop')) this.#settings.refresh();
    if (has('chapters', 'chapter')) this.#chapterMenu.refresh();
    if (has('paused', 'playbackRate') && navigator.mediaSession && sessionOwner === this) navigator.mediaSession.playbackState = state.paused ? 'paused' : 'playing';
  }

  #paintLabels() {
    this.query('.start').ariaLabel = this.#t('play');
    this.query('.timeline').ariaLabel = this.#t('seek');
    this.query('.volume-slider').ariaLabel = this.#t('volume');
    this.query('.control.settings').ariaLabel = this.#t('settings');
    this.query('.control.chapters').ariaLabel = this.#t('chapters');
    this.query('.control.cast').ariaLabel = this.#t(IS_APPLE && 'WebKitPlaybackTargetAvailabilityEvent' in window ? 'airplay' : 'cast');
    this.query('.live-text').textContent = this.#t('live');
    this.query('.retry').textContent = this.#t('retry');
    this.query('.error-title').textContent = this.#t('errorTitle');
    this.#shownSecond = '';
  }

  #paintSeekButtons() {
    const keyLabel = (action) => {
      const token = this.#keys.get(action)?.[0] ?? '';
      const key = token.split('+').pop();
      return KEY_LABELS[key] ?? (key.length === 1 ? key.toUpperCase() : key);
    };
    const step = this.seekStep;
    for (const [control, label, action] of [
      ['backward', 'seekBackward', 'jumpBackward'],
      ['forward', 'seekForward', 'jumpForward'],
    ]) {
      const button = this.query(`.control.${control}`);
      button.ariaLabel = this.#t(label, { n: step });
      button.querySelector('.seek-amount').textContent = String(step);
      button.dataset.key = keyLabel(action);
    }
    const keys = { play: 'togglePaused', mute: 'toggleMuted', captions: 'toggleCaptions', pip: 'togglePictureInPicture', fullscreen: 'toggleFullscreen' };
    for (const [control, action] of Object.entries(keys)) {
      const button = this.query(`.control.${control}`);
      button.dataset.key = keyLabel(action);
      button.setAttribute('aria-keyshortcuts', (this.#keys.get(action) ?? []).join(' '));
    }
  }

  #paintPlay() {
    const { paused, ended } = this.#state;
    const button = this.query('.control.play');
    button.dataset.state = ended ? 'ended' : paused ? 'paused' : 'playing';
    button.ariaLabel = this.#t(ended ? 'replay' : paused ? 'play' : 'pause');
    if (this.#tipControl === button) this.#showTip(button);
  }

  #paintVolume() {
    const { volume, muted } = this.#state;
    const level = muted ? 0 : volume;
    const button = this.query('.control.mute');
    button.dataset.level = level === 0 ? 'muted' : level < 0.5 ? 'low' : 'high';
    button.ariaLabel = this.#t(level === 0 ? 'unmute' : 'mute');
    const slider = this.query('.volume-slider');
    slider.style.setProperty('--_level', String(level));
    slider.ariaValueNow = String(Math.round(level * 100));
    slider.ariaValueText = `${Math.round(level * 100)}%`;
    if (this.#tipControl === button) this.#showTip(button);
  }

  // One segment for each chapter, or one for the whole video.
  #paintSegments() {
    const { chapters, duration, live } = this.#state;
    const segments = this.query('.segments');
    const spans = !live && duration && chapters.length > 1 ? chapters.map((chapter) => [chapter.start, Math.min(chapter.end, duration)]).filter(([start, end]) => end > start) : [[0, 1]];
    this.#segments = spans.length ? spans : [[0, 1]];
    segments.innerHTML = this.#segments.map(([start, end]) => `<span class="segment" style="flex-grow: ${end - start}"><span class="bar-fill buffered"></span><span class="bar-fill hovered"></span><span class="bar-fill played"></span></span>`).join('');
    this.#paintTimeline();
    this.#paintHover();
  }

  #segmentFill(time, [start, end], whole) {
    if (this.#segments.length === 1) return whole;
    return clamp((time - start) / (end - start), 0, 1);
  }

  #paintTimeline() {
    const { start, end } = this.#range();
    const span = end - start;
    const time = this.#scrub ?? this.#state.currentTime;
    const progress = span > 0 ? clamp((time - start) / span, 0, 1) : 0;
    const buffered = span > 0 ? clamp((this.#state.bufferedEnd - start) / span, 0, 1) : 0;
    const timeline = this.query('.timeline');
    timeline.style.setProperty('--_value', progress.toFixed(5));
    const elements = timeline.querySelectorAll('.segment');
    this.#segments.forEach((segment, i) => {
      const element = elements[i];
      if (!element) return;
      element.style.setProperty('--_played', this.#segmentFill(time, segment, progress).toFixed(5));
      element.style.setProperty('--_buffered', this.#segmentFill(this.#state.bufferedEnd, segment, buffered).toFixed(5));
    });
    const second = Math.floor(time);
    if (second !== this.#ariaSecond) {
      this.#ariaSecond = second;
      timeline.ariaValueMin = String(Math.floor(start));
      timeline.ariaValueMax = String(Math.floor(end));
      timeline.ariaValueNow = String(second);
      timeline.ariaValueText = this.#t('timeOf', { current: this.#spoken(time - start), duration: this.#spoken(span) });
    }
  }

  #paintHover() {
    const { start, end } = this.#range();
    const time = this.#hoverTime;
    const span = end - start;
    const whole = time == null || !(span > 0) ? 0 : clamp((time - start) / span, 0, 1);
    this.query('.segments').querySelectorAll('.segment').forEach((element, i) => {
      const segment = this.#segments[i];
      const fill = time == null ? 0 : this.#segmentFill(time, segment, whole);
      element.style.setProperty('--_hover', fill.toFixed(5));
      element.toggleAttribute('data-active', time != null && this.#segments.length > 1 && fill > 0 && fill < 1);
    });
  }

  #paintTime() {
    const { currentTime, duration, live, liveEdge, seekableEnd } = this.#state;
    const time = this.#scrub ?? currentTime;
    // Redrawn when the second, the duration or the mode changes.
    const shown = `${Math.floor(time)}|${duration}|${live}|${liveEdge}|${this.#remaining}`;
    if (shown === this.#shownSecond) return;
    this.#shownSecond = shown;
    const button = this.query('.time');
    const hours = duration >= 3600;
    if (live) {
      button.hidden = liveEdge;
      button.querySelector('.current').textContent = `-${clock(seekableEnd - time)}`;
      button.querySelector('.total').textContent = '';
      button.toggleAttribute('data-live', true);
      return;
    }
    button.hidden = false;
    button.removeAttribute('data-live');
    button.querySelector('.current').textContent = this.#remaining ? `-${clock(duration - time, hours)}` : clock(time, hours);
    button.querySelector('.total').textContent = clock(duration);
    button.dataset.tip = this.#t(this.#remaining ? 'showElapsed' : 'showRemaining');
    button.ariaLabel = `${this.#t('timeOf', { current: this.#spoken(time), duration: this.#spoken(duration) })}. ${button.dataset.tip}`;
  }

  #paintChapterProgress() {
    const { chapters, chapter } = this.#state;
    const current = chapters[chapter];
    const bar = this.query('#chapters-menu .item[aria-checked="true"] .item-progress');
    if (!bar || !current) return;
    bar.style.setProperty('--_progress', clamp((this.#state.currentTime - current.start) / (current.end - current.start), 0, 1).toFixed(4));
  }

  #paintError() {
    const { error } = this.#state;
    const overlay = this.query('.error');
    overlay.hidden = !error;
    if (!error) return;
    overlay.querySelector('.error-message').textContent = error.message;
    overlay.querySelector('.retry').hidden = error.code === 'hls';
  }

  // "1 minute, 5 seconds", in the page's language where the browser can.
  #spoken(seconds) {
    const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
    const parts = { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
    try {
      this.#durationFormat ??= new Intl.DurationFormat(this.closest('[lang]')?.lang || navigator.language, { style: 'long' });
      return this.#durationFormat.format(parts.hours || parts.minutes ? parts : { seconds: parts.seconds || 0 }) || clock(total);
    } catch {
      return clock(total);
    }
  }

  // ---- System media controls ----

  #claimSession() {
    const session = navigator.mediaSession;
    if (!session || typeof MediaMetadata !== 'function') return;
    sessionOwner = this;
    session.metadata = new MediaMetadata({ title: this.heading ?? '', artist: this.byline ?? '', artwork: this.poster ? [{ src: new URL(this.poster, document.baseURI).href }] : [] });
    const chapterStep = (direction) => {
      const { chapters, chapter } = this.#state;
      const target = chapters[clamp(chapter + direction, 0, chapters.length - 1)];
      if (target) this.seek(target.start);
    };
    const handlers = {
      play: () => this.play().catch(() => {}),
      pause: () => this.pause(),
      seekbackward: (details) => this.seekBy(-(details.seekOffset || this.seekStep)),
      seekforward: (details) => this.seekBy(details.seekOffset || this.seekStep),
      seekto: (details) => this.seek(details.seekTime),
      previoustrack: this.#state.chapters.length > 1 ? () => chapterStep(-1) : null,
      nexttrack: this.#state.chapters.length > 1 ? () => chapterStep(1) : null,
    };
    for (const [action, handler] of Object.entries(handlers)) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // Not every browser knows every action.
      }
    }
    session.playbackState = 'playing';
    this.#positionState();
  }

  #positionState() {
    const session = navigator.mediaSession;
    const { duration, playbackRate } = this.#state;
    if (!session?.setPositionState || sessionOwner !== this || !(duration > 0)) return;
    try {
      session.setPositionState({ duration, playbackRate, position: clamp(this.currentTime, 0, duration) });
    } catch {
      // A position past a duration still settling.
    }
  }

  #releaseSession() {
    if (sessionOwner !== this || !navigator.mediaSession) return;
    sessionOwner = null;
    navigator.mediaSession.metadata = null;
    for (const action of ['play', 'pause', 'seekbackward', 'seekforward', 'seekto', 'previoustrack', 'nexttrack']) {
      try {
        navigator.mediaSession.setActionHandler(action, null);
      } catch {
        // As above.
      }
    }
  }

  // ---- Storage ----

  #stored() {
    if (!this.storage) return {};
    try {
      return JSON.parse(localStorage.getItem(this.storage) ?? '{}') ?? {};
    } catch {
      return {};
    }
  }

  #save(patch) {
    if (!this.storage) return;
    try {
      localStorage.setItem(this.storage, JSON.stringify({ ...this.#stored(), ...patch }));
    } catch {
      // Storage full or blocked: the player works without it.
    }
  }

  #saveTime(now = false) {
    if (!this.storage || !this.#state.source || this.#state.live || this.#state.ended) return;
    const time = performance.now();
    if (!now && time - this.#lastSave < SAVE_EVERY) return;
    this.#lastSave = time;
    const t = this.currentTime;
    if (t > 1) this.#save({ time: { src: this.#state.source.src, t: Math.floor(t) } });
  }
}
