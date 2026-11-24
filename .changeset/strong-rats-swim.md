---
"@digdir/designsystemet-css": major
"@digdir/designsystemet-react": major
"@digdir/designsystemet-web": major
---

**Pagination:**
- Now uses `inert` to hide buttons/links, instead of the `aria-hidden`, `role="none"` and placeholder `aria-label` values used before.
- The `pagination()` helper is available without side effects from `@digdir/designsystemet-web/pagination`, and is re-exported from `@digdir/designsystemet-react` together with the types `PaginationOptions`, `PaginationResult` and `PaginationStep`.
- `Button` in `@digdir/designsystemet-react` supports `inert` in both React 18 and 19.
- `usePagination()` is deprecated. Use the `pagination()` helper instead. Its `prevButtonProps` and `nextButtonProps` now return `inert` instead of `aria-hidden`, so custom markup that relied on `aria-hidden` to hide previous/next must switch to `inert`.
- `aria-current="page"` is used instead of `aria-current="true"`
- The `--dsc-pagination-ellipsis` CSS variable is removed. Use `--dsc-pagination-ellipsis-size` to control the ellipsis width.
- The deprecated styling for manually setting `data-variant="tertiary"` on the current page is removed — `aria-current` alone drives active styling.
