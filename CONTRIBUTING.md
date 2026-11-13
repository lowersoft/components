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

## Storybook

Every story has a **Usage** tab next to Controls: the story's markup with
the current controls, the script tags or imports that load it, and the
component's attributes, events, slots and parts read from its JSDoc. Its
code lives in `.storybook/usage/`. Keep the class's JSDoc accurate and the
tab stays accurate with it.

## Adding a component

```bash
npm run new card-flip "Data Display/Cards"
```

This creates `src/components/card-flip/` and exports it from `src/index.js`. The build picks up every component folder automatically.

The second argument is the component's category in Storybook, and its story appears as `<Category>/<Name>`. The category has to be one the stories already use; the script lists them when it is not. Buttons are named without the word "Button" (`Controls/Buttons/Styled/Particle`), and the base component is `Controls/Buttons/Base`.

### Where a component goes

The sidebar has eight roots. Pick the root by what the component is for, then the group inside it:

| Root | For | Groups |
| --- | --- | --- |
| Controls | Entering a value or starting an action | Buttons (Actions, Social, Toggles, Styled), Fields, Choices, Sliders & Dials, Pickers, Upload & Signature |
| Navigation | Moving around an app or running its commands | Bars & Tabs, Menus, Search & Commands, Toolbars |
| Data Display | Showing an app's data | Cards, Charts & Metrics, Commerce, Lists & Boards |
| Media | Pictures, video and sound | Players, Editors, Galleries, Carousels & Marquees |
| Feedback | Status, progress and notices | Banners, Status & Progress |
| Flows | A whole task in an app: signing in, a dialog, a form | Auth, Dialogs, Forms |
| Sections | Full-width blocks of a marketing page | Heroes, Headlines, Features, How It Works, Pricing (Plans, Tables, Usage & Checkout), Comparisons, Social Proof, FAQs, Contact, Footers |
| Effects | Decoration behind or around content | Text (Cycling, Interactive, Accents), Backgrounds, Surfaces, Pointer |

Split a group into subgroups only once it holds more than about fifteen components that fall into clear kinds. A new group or subgroup also needs a place in `storySort` in `.storybook/preview.js`, and the scaffold opens one only with `--new-category`:

```bash
npm run new -- orbit-loader "Feedback/Loaders" --new-category
```

Inside a group the components sort alphabetically, so a new one needs no other change.

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
- An element can leave the page and come back, and `connected()` then runs again. Whatever the abort handler stops must be able to start again: reset a cancelled frame id to `0` and a "has played" flag to `false`.
- Name props in camelCase (`footnoteLink`); the attribute is its kebab-case form (`footnote-link`).
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
- [ ] Documented with JSDoc `@attr`, `@slot`, `@csspart`, `@fires` (Storybook's Usage tab is built from it)
- [ ] `npm run build` and `npm run lint` pass
- [ ] `npm run build-storybook` then `npm test` passes (once: `npx playwright install chromium --only-shell`)
- [ ] Changeset added (`npm run changeset`)

## Releasing

1. `npm run version-packages` turns the pending changesets into the new version in `package.json` and its entry in `CHANGELOG.md`.
2. Commit that and push it to `main`.
3. The Release workflow publishes the version npm does not have yet through trusted publishing, then tags it and creates its GitHub release. A push that does not change the version publishes nothing.
