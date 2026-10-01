resolves #5191
## Summary

### Current way to run CLI
When we started with the CLI we didn't have experience or much of a plan on how it would be used. This resulted in a patchwork of features, implemented as the need came up, which is cumbersome to use and not very thought out.

- You need to run two commands to generate css file
  - `designsystemet tokens create && designsystemet tokens build -t ./design-tokens -o ./design-tokens-build`
- Users need to look up what command to run or forget to run the latter command for CSS file.
- `tokens create` uses `designsystemet.config.json` for creating tokens with fields like `outDir` and `clean` tied only to create.
- `tokens build` _does not use_ `designsystemet.config.json`, instead you need to pass terminal arguments such as `--out-dir`, `--clean`, `--tokens` to configure how it runs.
- no option for turning off `types.d.ts` generation, or in general confusing configuration
- continuing in the pattern of `tokens create` and `tokens build` is not very scalable, as we can generate CSS without design-tokens.


### New way to run CLI

Declarative approach with everything that needs to be run defined in a config schema, `designsystemet.config.json`.

New `output` field which lets users decide which output they want to create/generate for designsystemet. Just executing the bin/command, `designsystemet`, creates everything defined in `output`, so users can pick and choose which outputs they want created for their designsystem.

This is inspired with how CLI for bundlers, `tsdown`, `rolldown`, `rollup` etc. so should be more familiar.

This feature is also part of stabilising the config schema so we can remove the experimental we have today under config readme and page.

**`tokens create` and `tokens build` still work, but are deprecated. `outDir` and `clean` are deprecated in favour of `output`, and the CLI offers to migrate existing config files automatically.**



### Stack

- #5416 – new `output` field and root command (this PR)
- #5438 – `tailwind` option on the `css` output, with Tailwind v3 and v4 support
- #5443 – default severity colors are added during config validation
- #5444 – new `types` output for TypeScript declarations
- #5451 – missing `--text-*` variables in the Tailwind theme file

## Preview

### Before

```jsonc
{
  "outDir": "./design-tokens", // only used by `tokens create`
  "clean": true,
  "themes": {
    "my-theme": {
      "colors": {
        "accent": "#0062BA",
        "neutral": "#1E2B3C"
      }
    }
  }
}
```

```bash
npx @digdir/designsystemet tokens create --config designsystemet.config.json
npx @digdir/designsystemet tokens build -t ./design-tokens -o ./design-tokens-build --experimental-tailwind
```

### After

```jsonc
{
  "themes": {
    "my-theme": {
      "colors": {
        "accent": "#0062BA",
        "neutral": "#1E2B3C"
      }
    }
  }
}
```

```bash
npx @digdir/designsystemet
```

With no `output` field, you get the defaults, `["design-tokens", "css", "types"]` once the whole stack is merged (`["design-tokens", "css"]` in this PR alone, as `types` arrives in #5444).

**This is primarily to match today's expected output when running `tokens create` and `tokens build`. I expect us to adjust what default output will be in the future.**

The config file is auto-detected (`designsystemet.config.json`, then `designsystemet.config.jsonc`), or passed with `-c, --config <path>`. All paths in `output` are relative to the config file.


## How `output` works

`output` is a list of what to create. Each item is either an output type using its defaults, or an object with custom settings:

```jsonc
{
  "output": [
    "design-tokens", // output type with default values

    // object with configured output options for css file
    {
      "type": "css",
      "dir": "./css",
      "tokensDir": "./design-tokens",
      "tailwind": "v4"
    },
  ]
}
```

- **Cleaning is on by default:** `cleanDir` defaults to `true`, so files that are no longer generated are removed. This was opt-in before (`clean: false`). Every output directory is cleaned once, before any output runs, so outputs can share a directory without deleting each other's files. The CLI refuses to clean a directory that contains the config file, or existing design tokens that `css` or `types` build from (`tokensDir`), and stops before deleting anything.
- **Order:** `design-tokens` always runs first, whatever order the outputs are listed in, since CSS and types can be built from the tokens.
- **`tokensDir`:** `css` and `types` build from `tokensDir`, or else from the `dir` of the `design-tokens` output. This is decided per output, so one `css` output can build from existing tokens while another is created from the themes.
- **Without design tokens:** `"output": ["css", "types"]` with no `tokensDir` creates CSS and types directly from the themes, without writing any design tokens to disk.
- **Without themes:** `themes` is only needed by outputs that are created from themes. A config with only a `css` output and a `tokensDir` builds CSS from existing design tokens and can leave `themes` out:

  ```json
  {
    "output": [{ "type": "css", "tokensDir": "./design-tokens" }]
  }
  ```

If an output needs themes and there are none, the CLI stops with an error saying so.

### Inject design-tokens

We know some users today have scripts to manipulate design-tokens before building. Usually adding colors or adjusting size scale. This is still possible with `output` by using two configs and running `designsystemet` twice with each config.

`create-tokens.json`
```jsonc
{
  "output": ["design-tokens"],
  "themes": {} // your theme configuration
}
```

`build-tokens.json`
```jsonc
{
  // only output is needed as we build css from design-tokens
  "output": [{
      "type": "css",
      "tokensDir": "./design-tokens",
   }]
}
```

run
```
designsystemet --config create-tokens.json &&
node inject-script.js && 
designsystemet --config build-tokens.json
```

### Tailwind (#5438)

The `css` output has a `tailwind` option that replaces `--experimental-tailwind`. By default (`false`) no Tailwind file is generated. Set it to the Tailwind version you use to also get a `<theme>.tailwind.css`:

- `"v4"` uses `@theme inline`, so Tailwind utilities reference the `--ds-*` variables directly. `data-color`, `data-color-scheme` and `data-size` then also apply to utilities, at any depth in the DOM.
- `"v3"` generates the same file as before. The deprecated `tokens build --experimental-tailwind` keeps generating v3.

Both versions also get `--text-sm`, `--text-md` and `--text-lg` mapped to the body font sizes in #5451. These were never generated because of a typo in the token name matching.

### Types (#5444)

Type declarations (`types.d.ts`) now have their own `types` output instead of always being written with the CSS. These augment `@digdir/designsystemet-types` with the theme's color names.

> [!NOTE]
> The `css` output no longer writes type declarations. If you set `output` yourself, add `"types"` to keep getting them. The default `output`, and configs migrated from `outDir`, already include it.

## Migrating existing configs

When the CLI finds `outDir` or `clean`, it offers to migrate the config file:

```
 ✋ Automigration detected
Config file designsystemet.config.json is eligible for migration: New output field
Your config file uses the deprecated outDir and clean fields.
This migration will replace them with a new output field if necessary.
? Do you want to migrate? (Y/n)
```

`"outDir": "./tokens", "clean": true` becomes:

```json
{
  "output": [
    { "type": "design-tokens", "dir": "./tokens" },
    { "type": "css", "tokensDir": "./tokens" },
    { "type": "types", "tokensDir": "./tokens" }
  ]
}
```

- **Default values:** if `outDir` already has its default value and `clean` isn't `false`, the migration just removes the old fields and doesn't add an `output`.
- **`clean: false`:** an explicit `"clean": false` is carried over as `"cleanDir": false` on every output that is cleaned, so folders the user opted out of cleaning are not deleted. This adds an `output` even when `outDir` has its default value.
- **Paths:** `outDir` was resolved from the directory the CLI ran in, but `output` paths are resolved from the config file. When the config isn't in that directory, the migration rewrites `outDir` so it still points to the same place.
- **Formatting:** the migration edits the file in place, so comments and formatting are kept. `output` is placed right after `$schema`.
- **Declining:** the config still works as before. `outDir` and `clean` still validate and print a deprecation warning.

`generate-config-from-tokens` uses the same mapping, so a generated config gets the same `output` as a migrated one.

## Deprecations

- **`tokens create` / `tokens build`:** these now print a deprecation warning and are marked `[deprecated]` in `--help`. They're kept for backwards compatibility and will be removed in a future release.
- **`outDir` / `clean`:** marked `deprecated` in the Config schema, and replaced by `output[].dir` / `output[].cleanDir`.
- **`experimental_tailwind`:** replaced by `tailwind` on the `css` output.

## Other changes

- **`generate-config-from-tokens`:** the generated config now uses `output` instead of the deprecated `outDir`, with the tokens directory written relative to the config file (`--out`) rather than as an absolute path. If the tokens are in the default `design-tokens` directory next to the config, no `output` is written and the defaults apply. It refuses an `--out` inside the tokens directory, since running that config would clean the directory it's in.
- **`themes` is optional:** `themes` is no longer required by the config schema or the published JSON schema. An empty `"themes": {}` is still rejected.
- **Severity color defaults (#5443):** the default `info`, `success`, `warning` and `danger` colors are now added during config validation, instead of in several places in the token generation. User-defined severity colors keep their value, and all severity colors are placed last. `neutral` is still required.
- **Root config:** the repo's `designsystemet.config.json` sets `"tailwind": "v3"` on its `css` output, so running the new command keeps the published `packages/css/theme/designsystemet.tailwind.css` identical to what `build:theme` generates.
- **Theme builder:** the "use theme" modal now shows `npx @digdir/designsystemet` as the build command. The config snippet no longer includes `outDir`, the hard-coded `typography`, or `borderRadius` when it's the default.
- **Removed `banner`:** the `banner` option on the `css` output was never used by the CLI, so it's gone from the schema.
- **Docs:** the `cli-config`, `own-theme`, `multiple-themes` and `css` pages (en and no), the CLI README and the CSS README are updated to use the new command, `output` and the `tailwind` option.