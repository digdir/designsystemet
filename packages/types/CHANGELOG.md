# @digdir/designsystemet-types

## 1.12.0

## 1.11.1

## 1.11.0

### Minor Changes

- **Version `1.10.0` was released by accident, and we are skipping to `1.11.0`** ([#4392](https://github.com/digdir/designsystemet/pull/4392))
  - Version `1.10.0` is deprecated on npm, and not accessible on Github. Use `1.11.0` or newer.

## 1.9.0

## 1.8.0

### Minor Changes

- Move submodule `@digdir/designsystemet/types` to a new package `@digdir/designsystemet-types` and change all references. ([#4241](https://github.com/digdir/designsystemet/pull/4241))

  After re-running `tokens build` downstream, this removes transitive dependencies on runtime dependencies on CLI tools like `commander` and `style-dictionary` which are never used in runtime, but are required for the CLI to function. It also makes code which doesn't use the CLI unaffected by our node version limitations (currently >= 22 due to `style-dictionary`).

  `@digdir/designsystemet/types` is preserved for now as a deprecated re-export of `@digdir/designsystemet-types` to avoid breaking people's builds.

## 1.8.0

### Minor Changes

- Move submodule `@digdir/designsystemet/types` to a new package `@digdir/designsystemet-types` and change all references. ([#4241](https://github.com/digdir/designsystemet/pull/4241))

  After re-running `tokens build` downstream, this removes transitive dependencies on runtime dependencies on CLI tools like `commander` and `style-dictionary` which are never used in runtime, but are required for the CLI to function. It also makes code which doesn't use the CLI unaffected by our node version limitations (currently >= 22 due to `style-dictionary`).

  `@digdir/designsystemet/types` is preserved for now as a deprecated re-export of `@digdir/designsystemet-types` to avoid breaking people's builds.
