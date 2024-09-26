---
"@digdir/designsystemet-css": patch
"@digdir/designsystemet-react": patch
---

Pagination:
- Remove attributes `currentPage` and `totalPages` on `Pagination`
- Replace `Pagination.Root` with `Paginaton`
- Replace `Pagination.Next`, `Pagination.Previous` and `Pagination.Ellipsis` with `Paginaton.Button`
- Make `usePagination` return spreadable props for subcomponents
- Add support for `showPages` and `onChange` in `usePagination`
