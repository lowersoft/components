import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/File Upload',
  component: 'lw-file-upload',
  render: (args) => `<lw-file-upload ${attributes(args)}></lw-file-upload>`,
  argTypes: {
    'max-files': { control: { type: 'number', min: 1 } },
    'upload-delay': { control: { type: 'number', step: 250 } },
  },
  args: { multiple: true, 'max-files': 5, 'upload-delay': 2000, 'simulate-failure': false },
};

export const Default = {};

// Images and PDFs only, up to 2 MB, and the second file's first try fails.
export const Restricted = {
  args: { accept: 'image/*,.pdf', 'max-size': 2 * 1024 * 1024, 'simulate-failure': true },
};

export const Single = {
  args: { multiple: false },
};

// A real `upload` function, here posting nowhere: it reports progress and
// stops when the row is removed.
export const CustomUpload = {
  render: () => {
    const upload = document.createElement('lw-file-upload');
    upload.multiple = true;
    upload.upload = (file, { onProgress, signal }) =>
      new Promise((resolve, reject) => {
        let percent = 0;
        const timer = setInterval(() => {
          percent += 10;
          onProgress(percent);
          if (percent >= 100) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
        signal.addEventListener('abort', () => {
          clearInterval(timer);
          reject(signal.reason);
        });
      });
    return upload;
  },
};
