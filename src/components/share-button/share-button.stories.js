import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PEOPLE = [
  { name: 'Dana Whitfield', email: 'dana@lowersoft.dev', role: 'owner' },
  { name: 'Omar Haddad', email: 'omar@lowersoft.dev', role: 'editor' },
  { name: 'Lena Fischer', email: 'lena@lowersoft.dev', role: 'viewer' },
  { name: 'Kai Tanaka', email: 'kai@lowersoft.dev', role: 'viewer' },
];

export default {
  title: 'Buttons/Share',
  component: 'lw-share-button',
  parameters: { layout: 'padded' },
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<div style="height: 30rem; padding: 2rem"><lw-share-button ${attributes(args)}></lw-share-button></div>`;
    const frame = template.content.firstElementChild;
    frame.firstElementChild.people = PEOPLE;
    return frame;
  },
  argTypes: {
    access: { control: 'inline-radio', options: ['restricted', 'link'] },
    align: { control: 'inline-radio', options: ['start', 'end'] },
  },
  args: {
    heading: 'Share “Q3 roadmap”',
    link: 'https://example.com/docs/q3-roadmap',
    access: 'restricted',
  },
};

export const Default = {};
