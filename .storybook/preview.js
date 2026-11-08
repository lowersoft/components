import { usageDecorator } from './usage/decorator.js';

/** @type {import('@storybook/web-components-vite').Preview} */
export default {
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    // Root, group and subgroup order; see "Where a component goes" in
    // CONTRIBUTING.md. Components sort alphabetically inside their group,
    // except that the plain building blocks lead. Storybook reads this
    // statically, so it stays a literal here.
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Controls', [
            'Buttons', ['Base', 'Actions', 'Social', 'Toggles', 'Styled'],
            'Fields', ['Text Input', 'Textarea', 'Floating Label', 'Number Input', 'Password Input', '*'],
            'Choices', ['Checkbox', 'Radio Group', 'Select', 'Switch', '*'],
            'Sliders & Dials', ['Range', '*'],
            'Pickers',
            'Upload & Signature',
          ],
          'Navigation', ['Bars & Tabs', 'Menus', 'Search & Commands', 'Toolbars'],
          'Data Display', ['Cards', 'Charts & Metrics', 'Commerce', 'Lists & Boards'],
          'Media', ['Players', 'Editors', 'Galleries', 'Carousels & Marquees'],
          'Feedback', ['Banners', 'Status & Progress'],
          'Flows', ['Auth', 'Dialogs', 'Forms'],
          'Sections', ['Heroes', 'Headlines', 'Features', 'How It Works', 'Pricing', ['Plans', 'Tables', 'Usage & Checkout'], 'Comparisons', 'Social Proof', 'FAQs', 'Footers'],
          'Effects', ['Text', ['Cycling', 'Interactive', 'Accents'], 'Backgrounds', 'Surfaces', 'Pointer'],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Color scheme',
      toolbar: {
        icon: 'mirror',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, { globals }) => {
      document.documentElement.dataset.theme = globals.theme;
      return story();
    },
    usageDecorator,
  ],
};
