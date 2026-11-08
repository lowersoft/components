// The contact sections' forms: the library's own fields in a native form,
// sent through an optional `send` function on the host.

/** The line under a contact form that says how sending went. */
export const STATUS_MARKUP = '<p class="status" role="status" aria-live="polite"></p>';

/**
 * Wires the contact form `form` in `host` until `signal` aborts. On submit
 * the fields check themselves and show what is missing; the values go to
 * `host.send(values)` when it is set, an async function, while the submit
 * button waits. A rejection shows its message under the form. Once sent,
 * the form clears, says `host.sent`, and `lw-send` brings the values.
 */
export const connectContactForm = (host, form, signal) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('.status');
    status.textContent = '';
    status.removeAttribute('data-tone');
    if (button) button.loading = true;
    try {
      await host.send?.(values);
    } catch (reason) {
      status.dataset.tone = 'error';
      status.textContent = reason?.message || 'The message could not be sent. Try again.';
      return;
    } finally {
      if (button) button.loading = false;
    }
    form.reset();
    status.dataset.tone = 'success';
    status.textContent = host.sent ?? '';
    host.emit('send', values);
  }, { signal });
};
