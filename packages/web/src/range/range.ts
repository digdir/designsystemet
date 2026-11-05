import { getComposedTarget, on, onHotReload, onMutation } from '../utils/utils';

const CSS_VALUE = '--_ds-range-value';
const SELECTOR_RANGE = 'input[type="range"]' as 'input';

const setValue = (el: HTMLInputElement) => {
  const min = Number(el.min) || 0;
  const max = Math.max(Number(el.max) || 100, min);
  const val = Math.max(Number(el.value) || 0, min);
  el.style.setProperty(CSS_VALUE, `${((val - min) / (max - min)) * 100}`);
};

const handleInput = (e: Event) => {
  const el = getComposedTarget(e);
  if (!isRange(el)) return;
  setValue(el);
  setTimeout(() => {
    if (el.isConnected && isRange(el)) setValue(el);
  });
};

/** Form reset updates values after the event, so wait a tick */
const handleReset = (e: Event) => {
  const form = getComposedTarget(e) as HTMLFormElement | null;
  setTimeout(() => {
    for (const el of form?.elements || []) if (isRange(el)) setValue(el);
  });
};

const handleMutations = (root: Document, records?: MutationRecord[]) => {
  for (const r of records || [null]) {
    const scope = (r?.target as Element) || root;
    if (!r) {
      for (const el of root.querySelectorAll(SELECTOR_RANGE)) setValue(el); // Initial setup
    } else if (r.type === 'attributes' && isRange(scope)) setValue(scope);
    else if (r.addedNodes) {
      for (const node of r.addedNodes) {
        if (isRange(node)) setValue(node);
        else if (node instanceof Element)
          for (const el of node.querySelectorAll(SELECTOR_RANGE)) setValue(el);
      }
    }
  }
};

// Performant way of checkig if node is input[type="range"]
const isRange = (node: Node | null): node is HTMLInputElement =>
  node?.nodeName === 'INPUT' && (node as HTMLInputElement).type === 'range';

// TODO: Does not update when changig input.value programatically
onHotReload('range', () => [
  on(document, 'input', handleInput, true),
  on(document, 'reset', handleReset, true),
  onMutation(document, handleMutations, {
    attributeFilter: ['value', 'min', 'max', 'step', 'type'],
    attributes: true,
    childList: true,
    subtree: true,
  }),
]);
