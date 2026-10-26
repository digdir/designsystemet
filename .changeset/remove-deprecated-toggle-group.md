---
"@digdir/designsystemet-react": major
"@digdir/designsystemet-css": major
"@digdir/designsystemet-web": major
---

**ToggleGroup:** Removed deprecated features:
- `data-toggle-group` and `--dsc-togglegroup-label`: use `aria-label` or `aria-labelledby`
- `icon` on `ToggleGroup.Item`
- `.ds-togglegroup` and `togglegroup.css`: use `.ds-toggle-group`
- Active styling for children with a manually set `data-variant="tertiary"`: leave out `data-variant` on toggle group children
