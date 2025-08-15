---
"@digdir/designsystemet-css": minor
---

**Link**: Automatically add recommended spacing to icons (svg or img), when there is also a `<span>` present.
- `<Link><Icon />Text</Link>` will not get spacing
- `<Link><Icon /> Text</Link>` will get a leading underlined space character between icon and text, which looks bad
- `<Link><Icon /><span>Text</span></Link>` will get recommended spacing
