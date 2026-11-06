import stepsStyles from '../styles/steps.scss?inline';

// Shared pieces of the how-it-works sections: the host, the heading and the
// lede. Add `stepsStyles` to the component's `static styles`.
export { stepsStyles };

/** Shows the host's `heading` and `lede` in `.heading` and `.lede`, hiding an empty lede. */
export const paintHead = (host) => {
  host.query('.heading').textContent = host.heading ?? '';
  const lede = host.query('.lede');
  lede.textContent = host.lede ?? '';
  lede.hidden = !host.lede;
};
