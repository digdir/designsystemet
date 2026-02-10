import { attr, on, onHotReload, onMutation, QUICK_EVENT } from '../utils/utils';

// Polyfill closedby functionaliy in Safari
// Also in Safari 26.2 where `closedBy` property is supported natively,
// but no corresponding functionality/behavior is implemented.
let DOWN_INSIDE = false; // Prevent close if selecting text inside dialog
const handleClosedbyAny = ({
  type,
  target: el,
  clientX: x = 0,
  clientY: y = 0,
}: Partial<MouseEvent>) => {
  if (type === 'pointerdown') {
    const r = (el as Element)?.closest?.('dialog')?.getBoundingClientRect();
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
const handleAriaAttributes = () => {
  for (const btn of document.querySelectorAll('button[command="show-modal"]'))
    attr(btn, 'aria-haspopup', 'dialog');
};

const handleCommand = ({ command, target }: Event & { command?: string }) =>
  command === '--show-non-modal' &&
  target instanceof HTMLDialogElement &&
  target.show();

onHotReload('dialog', () => [
  on(document, 'pointerdown pointerup', handleClosedbyAny, QUICK_EVENT),
  on(document, 'command', handleCommand, true),
  onMutation(document, handleAriaAttributes, {
    attributeFilter: ['command'],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
