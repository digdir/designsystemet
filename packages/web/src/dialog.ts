import { attr, on, onHotReload, QUICK_EVENT } from './utils';

// Polyfill closedby in Safari functionaliy in Safari
// Also in Safari 26.2 where `closedBy` property is supported natively,
// but no corresponding functionality/behavior is implemented.
let DOWN_INSIDE = false; // Prevent close if selecting text inside dialog
function handleClosedbyAny({
  type,
  target: el,
  clientX: x = 0,
  clientY: y = 0,
}: Partial<MouseEvent>) {
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
}

onHotReload('dialog-closedby', () => [
  on(document, 'pointerdown pointerup', handleClosedbyAny, QUICK_EVENT),
]);
