# Contributing

## Project structure

```
src/
  core/           Runtime shared by every component
    config.js       Tag and event prefix
    lw-element.js   Base class: props, batched updates, cleanup, events
    define.js       Registers <lw-*> elements and installs the theme
    styles.js       Constructable stylesheet cache
  styles/         SCSS source (also published for consumers)
    abstracts/      Tokens, functions, mixins
    themes.scss     Default light/dark theme
    host.scss       Base styles adopted by every shadow root
  components/
    <name>/
      <name>.js         Component class
      <name>.scss       Component styles
      <name>.stories.js Storybook stories
      index.js          Registration and public exports
```

## Adding a component

```bash
npm run new card-flip Cards
```

This creates `src/components/card-flip/` and exports it from `src/index.js`. The build picks up every component folder automatically.

The second argument is the Storybook category (`Components` when left out); stories appear as `<Category>/<Name>`. Buttons live under `Buttons`, named without the word "Button" (`Buttons/Particle`), with the base component as `Buttons/Base`.

## Writing a component

```js
export class LwExample extends LwElement {
  static styles = styles;
  static props = {
    open: { type: Boolean, reflect: true },
    count: { type: Number, default: 0 },
  };

  render() {
    return '<div part="base"><slot></slot></div>';
  }

  connected() {
    this.addEventListener('click', this.#toggle, { signal: this.signal });
  }

  updated(changed) {
    if (changed.has('open')) this.query('[part=base]').toggleAttribute('data-open', this.open);
  }

  #toggle = () => {
    this.open = !this.open;
    this.emit('toggle', { open: this.open });
  };
}
```

- `render()` runs once. Never re-render markup on prop changes; patch the DOM in `updated()`.
- `updated(changed)` is batched: many prop changes in one task produce one call.
- Pass `this.signal` to every listener, observer and animation so `disconnectedCallback` cleans them up.
- Style variants with `:host([attr])` selectors and private `--_*` custom properties instead of JavaScript.
- Events are dispatched as `lw-<name>`, bubbling and composed.

## Conventions

- Everything in English: code, comments, docs and demo content.
- Styles use tokens only (`lw.v(color-primary)`), never hard-coded colors.
- Wrap animation in `@include lw.motion { ... }` to respect `prefers-reduced-motion`.
- Expose stylable internals with `part` and content with `<slot>`.
- Add a helper to `core/` only when a second component needs it.
- No runtime dependencies.

## Definition of done

- [ ] Keyboard accessible with correct ARIA roles and states
- [ ] Respects `prefers-reduced-motion`
- [ ] Looks right in light and dark themes
- [ ] Stories cover the main props
- [ ] Documented with JSDoc `@attr`, `@slot`, `@csspart`, `@fires`
- [ ] `npm run build` passes
- [ ] Changeset added (`npm run changeset`)
