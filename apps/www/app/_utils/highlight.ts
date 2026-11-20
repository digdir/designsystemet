type HighlightOptions = {
  /**
   * The name of the highlight, styled with `::highlight(<name>)`
   * @default 'custom-highlight'
   */
  name?: string;
  /** Which text nodes to search, e.g. to leave out labels. All text in `scope` by default. */
  accept?: (node: Text) => boolean;
};

/**
 * Highlights text in `scope` with the CSS Custom Highlight API, which does not change the DOM.
 * Replaces the earlier highlight with the same name. Browsers without the API show no highlights.
 *
 * @param query the text to highlight, or several words to highlight wherever each is found.
 * Matches ignore case. Text split by markup, e.g. half in `<code>`, is not highlighted.
 */
export const highlightText = (
  query: string | string[],
  scope: HTMLElement,
  { name = 'custom-highlight', accept }: HighlightOptions = {},
) => {
  // Not supported in older browsers
  if (typeof CSS === 'undefined' || !CSS.highlights || !scope) return;

  // Remove only this highlight, preserving others such as syntax highlights
  CSS.highlights.delete(name);

  const words = (Array.isArray(query) ? query : [query])
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);
  if (!words.length) return;

  const treeWalker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      !accept || accept(node as Text)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });

  // A range for each place a word is found in a text node
  const ranges: Range[] = [];
  for (let node = treeWalker.nextNode(); node; node = treeWalker.nextNode()) {
    const text = node.textContent?.toLowerCase() ?? '';
    for (const word of words) {
      for (
        let index = text.indexOf(word);
        index !== -1;
        index = text.indexOf(word, index + word.length)
      ) {
        const range = new Range();
        range.setStart(node, index);
        range.setEnd(node, index + word.length);
        ranges.push(range);
      }
    }
  }

  CSS.highlights.set(name, new Highlight(...ranges));
};

/** Removes the highlight with this name, see highlightText */
export const clearHighlight = (name = 'custom-highlight') => {
  if (typeof CSS !== 'undefined' && CSS.highlights) CSS.highlights.delete(name);
};
