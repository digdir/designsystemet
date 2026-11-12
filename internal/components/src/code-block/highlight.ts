import { highlightAll } from 'microlighter';

let pending = false;
let queue: Promise<unknown> = Promise.resolve();
let visibilityObserver: MutationObserver | undefined;
let subscribers = 0;

export const observeCodeVisibility = () => {
  subscribers++;
  if (!visibilityObserver) {
    visibilityObserver = new MutationObserver((mutations) => {
      if (
        mutations.some(
          ({ target }) =>
            target instanceof Element &&
            (target.matches('pre[data-code-block]') ||
              target.querySelector('pre[data-code-block]')),
        )
      ) {
        scheduleCodeHighlight();
      }
    });
    visibilityObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['hidden'],
      subtree: true,
    });
  }

  return () => {
    if (--subscribers === 0) {
      visibilityObserver?.disconnect();
      visibilityObserver = undefined;
    }
  };
};

export const scheduleCodeHighlight = () => {
  if (
    typeof CSS === 'undefined' ||
    !CSS.highlights ||
    typeof Highlight === 'undefined' ||
    pending
  ) {
    return;
  }

  pending = true;
  queue = queue
    .then(() => {
      pending = false;
      return highlightAll({
        selector: 'pre[data-code-block]:not([hidden], [hidden] *) > code',
        languageAliases: {
          markup: 'html',
          jsx: 'tsx',
          objectivec: 'objective-c',
          'js-extras': 'javascript',
        },
      });
    })
    .catch((error: unknown) => {
      console.error('Unable to highlight code blocks:', error);
    });
};
