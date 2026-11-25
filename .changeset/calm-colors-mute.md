---
"@digdir/designsystemet": major
"@digdir/designsystemet-css": major
---

The `neutral` color is no longer required in a theme's `colors`. A theme needs at least one color that isn't a severity color. Components use the new muted color steps instead of `neutral`, so overriding `neutral`, or its steps, no longer changes component borders, read-only fields or quiet text. To change those, override the muted steps of each color, e.g. `border-muted`.

`text-default` is darker in light mode for all colors, which gives about 17.5:1 contrast against white instead of about 14:1. Dark mode does not change.

**Breaking:** Themes must be rebuilt with this version of the CLI. A theme built with an older version doesn't have the muted steps, so fields, dividers, dialogs and other components lose their border colors, and read-only fields and skeletons lose their background.

If you recreate your config from an older theme, from its CSS or from Figma, the old `text-default` is kept as an override. To get the new default, remove the `text-default` overrides from the config.
