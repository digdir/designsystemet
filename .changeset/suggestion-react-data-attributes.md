---
"@digdir/designsystemet-react": minor
---

**EXPERIMENTAL_Suggestion:** Replaced props with the same data attributes and events as `<ds-suggestion>`. Use `data-multiple` instead of `multiple`, `data-creatable` instead of `creatable`, `data-nofilter` on `Suggestion.List` instead of `filter={false}`, and `oncomboboxbeforematch` instead of `onBeforeMatch`. To filter with your own logic, use `data-nofilter` and only render the options you want to show.
