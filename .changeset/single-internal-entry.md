---
"@digdir/designsystemet": minor
---
**CLI:** Moved all internal functions to `@digdir/designsystemet/internal` export. This means the root exports under `/color`, `/tokens`, `/tokens/create`, `/tokens/types` and `/schemas` are removed.

- If you have used any of these exports and still need them, you can still use them under the `internal` export at your own risk.
