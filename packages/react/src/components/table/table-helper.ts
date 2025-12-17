import { on, onLoaded } from '../../utilities/dom';

const CLICKABLE = '[data-clickable="row"]';
const SKIP =
  'a,button,label,input,select,textarea,dialog,[role="button"],[popover],[contenteditable]';

// Forward click to data-clickable="row" element
const handleTableRowClick = (event: Partial<MouseEvent>) => {
  const isValidUserClick = event.isTrusted && event.target instanceof Element;
  const isValidMouseButton = event.type === 'click' || event.button === 1;
  const isNewTab = event.button === 1 || event.metaKey || event.ctrlKey;

  if (isValidUserClick && isValidMouseButton) {
    const target = event.target.closest('tr')?.querySelector(CLICKABLE);

    if (target instanceof HTMLElement && !event.target.closest(SKIP)) {
      if (target instanceof HTMLAnchorElement && isNewTab)
        return window.open(target.href, undefined, target.rel); // If middle click or cmd/ctrl click on link, open in new tab
      event.stopImmediatePropagation?.(); // We'll trigger a new click event anyway, so prevent actions on this one
      target.click(); // Forward click to the clickable element
    }
  }
};

onLoaded('table-helper', () => [
  on(window, 'click auxclick', handleTableRowClick, true), // Use capture to ensure we run before other click listeners
]);
