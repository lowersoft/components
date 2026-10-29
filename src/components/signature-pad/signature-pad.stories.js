import './index.js';

export default {
  title: 'Inputs/Signature Pad',
  component: 'lw-signature-pad',
};

export const Default = {
  render: () => '<lw-signature-pad></lw-signature-pad>',
};

// A required field: the form will not submit an empty pad, and the
// signature is sent as SVG.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; width: 380px; max-width: 100%; font: 0.8125rem system-ui">
        <lw-signature-pad name="signature" required></lw-signature-pad>
        <button style="justify-self: start">Submit</button>
        <div class="preview" style="height: 80px; border: 1px dashed #d4d4d8; border-radius: 0.5rem"></div>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const svg = new FormData(form).get('signature');
      form.querySelector('.preview').innerHTML = svg.replace('<svg ', '<svg style="height: 100%; width: 100%" ');
    });
    return form;
  },
};
