import { addons } from 'storybook/preview-api';
import { USAGE_REQUEST, USAGE_RESULT } from './events.js';
import { formatMarkup } from './format.js';
import { entryOf, referenceOf } from './reference.js';

const channel = addons.getChannel();
let last = null;
let pending = 0;

// The panel asks when it opens, in case it missed the story's render.
channel.on(USAGE_REQUEST, () => last && channel.emit(USAGE_RESULT, last));

const publish = async (source, { id, component }) => {
  const ticket = ++pending;
  const { markup, tags } = formatMarkup(source);
  // The story's own component first, then the others it uses.
  const entries = [...new Set([component, ...tags].filter(Boolean).map(entryOf).filter(Boolean))];
  const reference = component ? await referenceOf(component).catch(() => null) : null;
  // A newer render has taken over.
  if (ticket !== pending) return;
  last = { storyId: id, component, markup, entries, reference };
  channel.emit(USAGE_RESULT, last);
};

/** Sends the rendered story's markup and its component's API to the Usage panel. */
export const usageDecorator = (story, context) => {
  const result = story();
  // The panel is a nicety: it never gets in the way of the story.
  publish(result, context).catch((error) => console.warn('Usage panel:', error));
  return result;
};
