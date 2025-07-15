---
"@digdir/designsystemet-react": patch
---

**Suggestion:**
- Deprecated `value`, use `selected` instead
- Deprecated `defaultValue`, use `defaultSelected` instead
- Deprecated `onValueChange`, use `onSelectedChange` instead
- Deprecated `Suggestion.Chips`, use `renderSelected` on `Suggestion` instead
- Add `onBeforeMatch` to `Suggestion` for custom matching
- Revert input `value` when to current `selected` when no match
