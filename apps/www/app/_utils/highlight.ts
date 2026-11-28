const HIGHLIGHT_NAME = 'custom-highlight';

/**
 * Highlight every word of `query` inside the given elements, using the CSS
 * Custom Highlight API. Pass an empty query or no elements to clear.
 */
export const highlightText = (query: string, scopes: Iterable<Element>) => {
  // Not supported in older browsers
  if (typeof CSS === 'undefined' || !CSS.highlights) return;

  // Remove only search results, preserving syntax highlights.
  CSS.highlights.delete(HIGHLIGHT_NAME);

  // Same word splitting as the search index, so "data-size" highlights both words
  const terms = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 1);
  if (!terms.length) return;

  const ranges: Range[] = [];

  for (const scope of scopes) {
    const treeWalker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);

    for (let node = treeWalker.nextNode(); node; node = treeWalker.nextNode()) {
      const text = node.textContent?.toLowerCase();
      if (!text) continue;

      for (const term of terms) {
        let index = text.indexOf(term);
        while (index !== -1) {
          const range = new Range();
          range.setStart(node, index);
          range.setEnd(node, index + term.length);
          ranges.push(range);
          index = text.indexOf(term, index + term.length);
        }
      }
    }
  }

  if (ranges.length)
    CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges));
};
