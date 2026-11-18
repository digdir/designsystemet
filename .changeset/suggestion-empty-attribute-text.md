---
"@digdir/designsystemet-web": major
"@digdir/designsystemet-react": major
---

**Suggestion:** Text in the `data-empty` attribute, such as `data-empty="Legg til %s"`, is no longer read. `data-empty` now only marks the option, and the create text comes from `--dsc-suggestion-create-text`. In React, `data-empty` on `Suggestion.Option` and `Suggestion.Empty` is now a `boolean` instead of a `string`. Replace `data-empty="…"` with `data-empty`, and set `--dsc-suggestion-create-text` to change the text.
