---
"@digdir/designsystemet-css": major
"@digdir/designsystemet-react": major
"@digdir/designsystemet-web": major
---

**Pagination:** Now uses `hidden` to hide buttons/links instead of arbitrary `aria-label` values. Previous/next are hidden by CSS only, so `aria-hidden` is no longer needed.

Breaking:
- `pagination()` from `@digdir/designsystemet-web` returns a new shape: `prev` and `next` are `{ value: number }` instead of `number`, and each entry in `pages` is `{ value: number, 'aria-current'?: 'page' }` instead of `{ page, current, key }`. `key` is removed — use the page number or the array index for React keys.
- `usePagination()` no longer returns `aria-hidden` on `prevButtonProps`/`nextButtonProps`.
- The `--dsc-pagination-ellipsis` CSS variable is removed. Use `--dsc-pagination-ellipsis-size` to control the ellipsis width.
- The deprecated styling for manually setting `data-variant="tertiary"` on the current page is removed — `aria-current` alone drives active styling.
