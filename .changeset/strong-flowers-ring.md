---
'@digdir/designsystemet': minor
---

Fix crash when running CLI command `tokens build`:
- add --verbose option to `tokens build` for easier debugging
- `tokens build` crashed when run on result of `tokens create`

Update tokens template used by CLI command `tokens create`
- removes `ingress`, renames `paragraph` to `body`, and adds `xl` size
