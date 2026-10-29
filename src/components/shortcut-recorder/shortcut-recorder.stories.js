import './index.js';

export default {
  title: 'Inputs/Input/Shortcut Recorder',
  component: 'lw-shortcut-recorder',
};

// Press a binding and hold new keys; try ⌘/Ctrl+S on another row to see a clash.
export const Default = {
  render: () => '<lw-shortcut-recorder></lw-shortcut-recorder>',
};

export const Editor = {
  render: () => {
    const recorder = document.createElement('lw-shortcut-recorder');
    recorder.shortcuts = [
      { id: 'bold', label: 'Bold', keys: 'mod+b' },
      { id: 'italic', label: 'Italic', keys: 'mod+i' },
      { id: 'link', label: 'Insert link', keys: 'mod+k' },
      { id: 'code', label: 'Inline code', keys: 'mod+e' },
      { id: 'heading', label: 'Heading', keys: '' },
    ];
    return recorder;
  },
};
