---
"@digdir/designsystemet-react": major
"@digdir/designsystemet-css": major
---

**AvatarStack:** Removed `EXPERIMENTAL_AvatarStack` and the deprecated props:
- `gap`, `avatarSize` and `overlap`: use `--dsc-avatar-stack-gap`, `--dsc-avatar-stack-size` and `--dsc-avatar-stack-overlap`
- `suffix`: add a trailing `<li>` with text
Avatar stack now always sets the radius and size of its avatars.
