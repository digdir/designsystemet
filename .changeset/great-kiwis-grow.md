---
"@digdir/designsystemet-react": patch
"@digdir/designsystemet-theme": patch
"@digdir/designsystemet-types": patch
"@digdir/designsystemet": patch
---

Move submodule `@digdir/designsystemet/types` to a new package `@digdir/designsystemet-types` and changes all references.

After re-running `tokens build` downstream, this removes transitive dependencies on runtime dependencies on CLI tools like `commander` and `style-dictionary` which are never used in runtime, but are required for the CLI to funciton. It also makes code which doesn't use the CLI unaffected by our node version limitations (currently >= 22 due to `style-dictionary`).

`@digdir/designsystemet/types` is preserved for now as a deprecated re-export of `@digdir/designsystemet-types` to avoid breaking people's builds.
