---
"@digdir/designsystemet-react": major
"@digdir/designsystemet-css": major
---

**Suggestion, Search:** Removed deprecated features:
- `aria-label` on `Suggestion.Clear` and `Search.Clear`: use `data-sr-clear` or `--dsc-suggestion-sr-clear` on `Suggestion` or `Search`
- `singular` and `plural` on `Suggestion.List`: use `data-sr-singular` and `data-sr-plural` on `Suggestion`
- Support for the old `<del>` clear element: use `Suggestion.Clear` (`<button type="reset">`)
- `search.css`: import `suggestion.css` instead
- The `--dsc-search-*` variables: use the matching `--dsc-suggestion-*` variables
