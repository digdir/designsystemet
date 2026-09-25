# @digdir/designsystemet

CLI and tooling for Designsystemet

Use `--help` for available commands and options

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.


## Usage

Use `npx @digdir/designsystemet` to create design tokens and CSS for use with Designsystemet, based on a [config file](#using-a-config-file).

This allows you to define themes including custom colors, font-family, and border-radius.
We recommend using the [Designsystemet theme builder](https://theme.designsystemet.no/) for generating a valid config.

| Option | Description |
| ------ | ----------- |
| `-c, --config <path>` | Path to config file (auto-detects `designsystemet.config.json` or `designsystemet.config.jsonc`) |
| `--dry` | Dry run - no files will be written |
| `--verbose` | Enable verbose output |
| `--skip-check` | Skip migration check |
| `-y, --yes` | Skip user prompts |

> ⚠️ **DEPRECATED** ⚠️  
> The `tokens create` and `tokens build` commands are deprecated and will be removed in a future release.
> Use `designsystemet` with a config file instead.

#### Update tokens and CSS

Whenever a new version of the CLI is released, or you have done changes, re-run `npx @digdir/designsystemet`.
Output directories are cleaned by default (`cleanDir`), which removes any deprecated or unneeded files.

> ⚠️ **WARNING** ⚠️  
> The design tokens created by this tool are considered an implementation detail, and is subject
> to change at any time without being considered a breaking change. We **only** support customisations
> done through the config. Direct editing of the design tokens are **not** supported.
>
> The CSS files created by this tool are considered build artifacts. They should **not** be
> edited directly. While the CSS will not change unexpectedly, new variables may be added at any
> time.
>
> Therefore, it is necessary to routinely re-run this command when upgrading the libraries.
> This will remove any direct edits to the design tokens and CSS.

### Using a config file

> ⚠️ **WARNING** ⚠️  
> The typography feature is experimental. The config schema may change at any time.

The CLI will auto-detect a `designsystemet.config.json` or `designsystemet.config.jsonc` file in the current directory. You can also use the `--config <path>` option to supply a different config name and location.

Both `.json` and `.jsonc` files may contain comments and trailing commas (JSONC).

To get started, use this template for a `designsystemet.config.json` file:

```jsonc
{
  "$schema": "node_modules/@digdir/designsystemet/dist/config.schema.json",
}
```

In editors which support JSON Schema, the `$schema` will then  give you editor hints for the structure of the file.

#### Minimal config example
```jsonc
{
  "$schema": "./node_modules/@digdir/designsystemet/dist/config.schema.json",
  "themes": {
    "theme": {
      "colors": {
        "accent": "#1E98F5",
        "neutral": "#1E2B3C",
      },
      "borderRadius": 4
    }
  }
}
```
To generate new design tokens and CSS files, you would then run:

```
npx @digdir/designsystemet
```

This creates design tokens in `design-tokens` and CSS in `design-tokens-build`, relative to the config file.

#### Output

Use `output` to choose what is created and where. Each item is either an output type (`"design-tokens"` or `"css"`) using its default settings, or an object:

```jsonc
{
  "output": [
    // defaults: dir "design-tokens", cleanDir true
    { "type": "design-tokens", "dir": "../path/to/design-tokens" },
    // defaults: dir "design-tokens-build", tokenDir "design-tokens", cleanDir true
    { "type": "css", "dir": "../path/to/css", "tokenDir": "../path/to/design-tokens" },
  ],
}
```

Design tokens are always created before CSS. `tokenDir` should match the `dir` of the `design-tokens` output.

If you only need CSS, use `"output": ["css"]` without `tokenDir`. The CSS is then created directly from the themes, without writing any design tokens.

The `outDir` and `clean` fields are deprecated in favour of `output`. The CLI will offer to migrate your config file automatically.

#### Complex config example

Have a look at the `*.config.json` files under the `packages/cli` in the Github repo for more complex examples.

#### Create config from existing tokens

You can get a minimal config file, meaning without overrides, generated from existing design tokens using the following command:

```sh
npx @digdir/designsystemet generate-config-from-tokens --dir <path to design tokens>
```
