import {
  attr,
  getComposedTarget,
  on,
  onHotReload,
  QUICK_EVENT,
} from '../utils/utils';

// Polyfill closedby functionaliy in Safari
// Also in Safari 26.2 where `closedBy` property is supported natively,
// but no corresponding functionality/behavior is implemented.
let DOWN_INSIDE = false; // Prevent close if selecting text inside dialog
const handleClosedbyAny = (event: Event) => {
  const { type, clientX: x = 0, clientY: y = 0 } = event as MouseEvent;
  const el = getComposedTarget(event);
  if (!(el instanceof Element)) return;
  if (type === 'pointerdown') {
    const r = el.closest?.('dialog')?.getBoundingClientRect();
    const isInside =
      r && r.top <= y && y <= r.bottom && r.left <= x && x <= r.right;

    DOWN_INSIDE = !!isInside;
  } else {
    const isDialog = el instanceof HTMLDialogElement;
    const isClose = isDialog && !DOWN_INSIDE && attr(el, 'closedby') === 'any';

    DOWN_INSIDE = false; // Reset on every pointerup
    if (isClose) requestAnimationFrame(() => el.open && el.close()); // Close if browser did not do it
  }
};

// Ensure buttons that trigger a modeal dialog has aria-haspopup="dialog" for better screen reader experience
const MODAL = 'show-modal';
const NON_MODAL = '--show-non-modal';
const handleAriaAttributes = (event: Event) => {
  const el = (getComposedTarget(event) as Element).closest?.('[command]');
  if (el && attr(el, 'command') === MODAL) attr(el, 'aria-haspopup', 'dialog');
};

const handleCommand = ({ command, target }: Event & { command?: string }) =>
  command === NON_MODAL && target instanceof HTMLDialogElement && target.show();

onHotReload('dialog', () => [
  on(document, 'command', handleCommand, QUICK_EVENT),
  on(document, 'focus', handleAriaAttributes, QUICK_EVENT),
  on(document, 'pointerdown pointerup', handleClosedbyAny, QUICK_EVENT),
]);
