---
"@digdir/designsystemet-web": minor
"@digdir/designsystemet-react": minor
---

**Suggestion:** New `suggestion` helper to make a controlled `<ds-suggestion>` easier in any framework. `suggestion(selected)` converts strings to `{ label, value }` items, `suggestion(selected, event)` returns the next state from a `comboboxbeforeselect` event, and `suggestion(selected, renderFn)` can be used to render each item.
