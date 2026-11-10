---
"@digdir/designsystemet-react": minor
---

**EXPERIMENTAL_Suggestion:** Removed `selected`, `defaultSelected`, `onSelectedChange` and `renderSelected`. Render selected items as `<data value="…">label</data>` inside `Suggestion`, and use `oncomboboxbeforeselect` together with the new `suggestion` helper to control them.
