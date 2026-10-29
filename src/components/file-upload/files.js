const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];
const SIMULATED_TICK = 80;

/** 1536 -> "1.5 KB", 20480 -> "20 KB". */
export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : Number(value.toFixed(1))} ${UNITS[i]}`;
};

/** Matches like the input's `accept`: "image/png", "image/*" or ".pdf". */
export const matchesType = (file, type) => {
  const accepted = type.toLowerCase();
  if (accepted.startsWith('.')) return file.name.toLowerCase().endsWith(accepted);
  const fileType = file.type.toLowerCase();
  if (accepted.endsWith('/*')) return fileType.startsWith(accepted.slice(0, -1));
  return fileType === accepted;
};

// ".pdf" -> "PDF", "image/svg+xml" -> "SVG", "image/*" -> "images".
const describeType = (type) => {
  if (type.startsWith('.')) return type.slice(1).toUpperCase();
  const [kind = '', subtype = ''] = type.split('/');
  return subtype === '*' ? `${kind.toLowerCase()}s` : subtype.split('+')[0].toUpperCase();
};

/** ["image/*", ".pdf"] -> "Images or PDF". */
export const describeTypes = (types) => {
  const labels = types.map(describeType).filter(Boolean);
  if (labels.length === 0) return 'Any file';
  const text = labels.length > 1 ? `${labels.slice(0, -1).join(', ')} or ${labels.at(-1)}` : labels[0];
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** Up to four letters of the extension, for a badge. */
export const extensionOf = (name) => {
  const dot = name.lastIndexOf('.');
  return dot <= 0 || dot === name.length - 1 ? 'FILE' : name.slice(dot + 1, dot + 5).toUpperCase();
};

export const isFileDrag = (event) => Boolean(event.dataTransfer?.types.includes('Files'));

export const countDraggedFiles = (dataTransfer) => [...dataTransfer.items].filter((item) => item.kind === 'file').length;

/** Stand-in upload that advances in uneven steps, like a real network. */
export const simulateUpload = ({ onProgress, signal }, duration, shouldFail) =>
  new Promise((resolve, reject) => {
    if (duration <= 0) {
      resolve();
      return;
    }
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + (100 * SIMULATED_TICK * (0.4 + Math.random() * 1.2)) / duration, 100);
      if (shouldFail && progress >= 58) {
        clearInterval(interval);
        reject(new Error('Connection lost'));
        return;
      }
      onProgress(progress);
      if (progress < 100) return;
      clearInterval(interval);
      resolve();
    }, SIMULATED_TICK);
    signal.addEventListener('abort', () => {
      clearInterval(interval);
      reject(signal.reason);
    });
  });
