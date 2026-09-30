import '../invokers/invokers'; // Make sure to import invokers so command="show-modal" works as expected
import {
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  attr,
  getComposedPath,
  getComposedTarget,
  on,
  onHotReload,
  QUICK_EVENT,
  warn,
} from '../utils/utils';

// Polyfill closedby functionaliy in Safari
// Also in Safari 26.2 where `closedBy` property is supported natively,
// but no corresponding functionality/behavior is implemented.
let DOWN_INSIDE = false; // Prevent close if selecting text inside dialog
const handleClosedbyAny = (event: Event) => {
  const { type, clientX: x = 0, clientY: y = 0 } = event as MouseEvent;
  const el = getComposedTarget(event);
  if (el && type === 'pointerdown') {
    for (const dialog of getComposedPath(el)) {
      if (dialog.nodeName !== 'DIALOG') continue;
      const r = (dialog as Element).getBoundingClientRect();
      DOWN_INSIDE = r.top <= y && y <= r.bottom && r.left <= x && x <= r.right;
      return; // Stop traversing once we find a dialog
    }
  } else {
    const isDialog = el?.nodeName === 'DIALOG'; // Faster than el instanceof HTMLDialogElement
    const isClose = isDialog && !DOWN_INSIDE && attr(el, 'closedby') === 'any';

    DOWN_INSIDE = false; // Reset on every pointerup
    if (isClose) setTimeout(close, 0, el); // Close if browser did not do it
  }
};

const close = (dialog: HTMLDialogElement) => dialog.open && dialog.close();

// Ensure buttons that trigger a modeal dialog has aria-haspopup="dialog" for better screen reader experience
const MODAL = 'show-modal';
const NON_MODAL = '--show-non-modal';
const handleAriaAttributes = (event: Event) => {
  for (const el of event.composedPath() as Element[]) {
    const command = el.nodeType === 1 && attr(el, 'command');
    if (command === MODAL || command === NON_MODAL)
      return attr(el, 'aria-haspopup', 'dialog');
  }
};

const handleCommand = ({ command, target }: Event & { command?: string }) =>
  command === NON_MODAL && target instanceof HTMLDialogElement && target.show();

const handleToggle = ({ target: el, newState }: Partial<ToggleEvent>) => {
  if (el instanceof HTMLDialogElement && newState === 'open') {
    const hasAria = attr(el, ARIA_LABEL) || attr(el, ARIA_LABELLEDBY);
    const heading = el.querySelector('h2,h3,h4,h5,h6')?.textContent.trim();

    if (hasAria?.trim()) return;
    if (heading) attr(el, ARIA_LABEL, heading); // Using aria-label instead of aria-labelleby to avoid need of suppressHydrationWarning on all heading elements
    warn(
      'Missing accessible name on:',
      el,
      `\nAdd a heading (h2-h6), or set ${ARIA_LABEL} or ${ARIA_LABELLEDBY} to provide an accessible name for screen readers.`,
    );
  }
};

onHotReload('dialog', () => [
  on(document, 'command', handleCommand, QUICK_EVENT),
  on(document, 'focus', handleAriaAttributes, QUICK_EVENT),
  on(document, 'pointerdown pointerup', handleClosedbyAny, QUICK_EVENT),
  on(document, 'toggle', handleToggle, QUICK_EVENT),
]);
