import '../button/index.js';
import './index.js';

const KINDS = [
  ['upload', 'Upload photos'],
  ['export', 'Export report'],
  ['archive', 'Archive thread'],
  ['sync', 'Sync calendar'],
];

// A playground: each button starts a pretend task that reports to the island.
const playground = () => {
  const root = document.createElement('div');
  root.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 2rem; width: 40rem; max-width: 100%; height: 320px; font: 14px system-ui, sans-serif';
  root.innerHTML = `<div class="actions" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem">${KINDS.map(([kind, label]) => `<lw-button variant="secondary" size="sm" data-kind="${kind}">${label}</lw-button>`).join('')}</div><p class="hint" style="margin: 0; color: var(--lw-color-muted-foreground)">Start a task, then hover the island</p><lw-status-island></lw-status-island>`;
  const island = root.querySelector('lw-status-island');
  const hint = root.querySelector('.hint');
  let counter = 0;

  const set = (tasks) => {
    island.tasks = tasks;
    hint.hidden = tasks.length > 0;
  };
  const update = (id, patch) => set(island.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  const remove = (id) => set(island.tasks.filter((task) => task.id !== id));
  island.addEventListener('lw-dismiss', () => setTimeout(() => (hint.hidden = island.tasks.length > 0)));

  const run = (id, { speed, failAt, onDone }) => {
    let progress = 0;
    const timer = setInterval(() => {
      if (!island.isConnected) return clearInterval(timer);
      progress = Math.min(1, progress + speed * (0.5 + Math.random()));
      if (failAt !== undefined && progress >= failAt) {
        clearInterval(timer);
        update(id, {
          status: 'error',
          label: 'Sync failed',
          detail: 'Calendar offline',
          progress: undefined,
          action: {
            label: 'Retry',
            onClick: () => {
              update(id, { status: 'running', label: 'Syncing the build cache', detail: undefined, progress: 0, action: undefined });
              run(id, { speed, onDone });
            },
          },
        });
        return;
      }
      update(id, { progress });
      if (progress >= 1) {
        clearInterval(timer);
        setTimeout(onDone, 250);
      }
    }, 180);
  };

  const start = (kind) => {
    counter += 1;
    const id = `${kind}-${counter}`;
    if (kind === 'archive') {
      set([...island.tasks, { id, status: 'done', label: 'Thread archived', action: { label: 'Undo', onClick: () => update(id, { label: 'Thread restored', action: undefined }) } }]);
    } else if (kind === 'upload') {
      set([...island.tasks, { id, status: 'running', label: 'Uploading symbols', detail: '214 files', progress: 0 }]);
      run(id, { speed: 0.045, onDone: () => update(id, { status: 'done', label: '214 symbol files uploaded', detail: undefined, action: { label: 'View', onClick: () => remove(id) } }) });
    } else if (kind === 'export') {
      set([...island.tasks, { id, status: 'running', label: 'Exporting trace', progress: 0 }]);
      run(id, { speed: 0.07, onDone: () => update(id, { status: 'done', label: 'Trace ready', detail: 'cold-start.trace', action: { label: 'Open', onClick: () => remove(id) } }) });
    } else {
      set([...island.tasks, { id, status: 'running', label: 'Syncing the build cache', progress: 0 }]);
      run(id, { speed: 0.06, failAt: counter % 2 === 0 ? undefined : 0.62, onDone: () => update(id, { status: 'done', label: 'Calendar synced', detail: undefined, action: undefined }) });
    }
  };

  root.querySelector('.actions').addEventListener('click', (event) => {
    const button = event.target.closest('[data-kind]');
    if (button) start(button.dataset.kind);
  });
  return root;
};

export default {
  title: 'Navigation/Status Island',
  component: 'lw-status-island',
  render: playground,
};

export const Default = {};

// A fixed set of tasks, one of each kind.
export const Tasks = {
  render: () => `<lw-status-island dismiss-after="600000" tasks='${JSON.stringify([
    { id: 'a', status: 'done', label: 'Thread archived', action: { label: 'Undo' } },
    { id: 'b', status: 'error', label: 'Sync failed', detail: 'Calendar offline', action: { label: 'Retry' } },
    { id: 'c', status: 'running', label: 'Uploading symbols', detail: '214 files', progress: 0.42 },
  ])}'></lw-status-island>`,
};
