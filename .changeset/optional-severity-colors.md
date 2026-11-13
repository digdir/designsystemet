---
"@digdir/designsystemet": major
---

Severity colors (`info`, `success`, `warning` and `danger`) are now optional, and are no longer added to a theme by default. Add the ones your theme needs to `colors`. `overrides.severity` is deprecated, as severity colors are set in `colors` like any other color.

The CLI reads the version of a config from its `$schema`. When a config does not point to a versioned schema (`config.v2.schema.json`, or `https://designsystemet.no/schemas/config/2.0.0.json` or later), the CLI offers to migrate it: the four default severity colors are added to `colors` in every theme, `overrides.severity` is moved into `colors`, and `$schema` is updated. Your themes stay the same, and you can then remove the severity colors you do not use.
