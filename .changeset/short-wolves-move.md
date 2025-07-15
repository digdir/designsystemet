---
"@digdir/designsystemet-react": patch
---

**Suggestion:**
- Depreciate `value`, use `selected` instead
- Depreciate `defaultValue`, use `defaultSelected` instead
- Depreciate `onValueChange`, use `onSelectedChange` instead
- Depreciate `Suggestion.Chips`, use `renderSelected` on `Suggestion` instead
- Add `onBeforeMatch` to `Suggestion` for custom matching
- Revert input `value` when to current `selected` when no match
