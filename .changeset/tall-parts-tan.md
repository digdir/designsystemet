---
"@digdir/designsystemet-react": minor
---

**Suggestion**: Removed type `SuggestionValues`, as this union is no longer useful. Use `string` or `SuggestionItem` when `multiple` is `false`, and `string[]` or `SuggestionItem[]` when `multiple` is `true`.
