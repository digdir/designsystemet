import { highlightAll } from 'microlighter';

let pending = false;
let queue: Promise<unknown> = Promise.resolve();

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
        selector: 'pre[data-code-block] > code',
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
