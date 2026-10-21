# @digdir/designsystemet

CLI and tooling for Designsystemet

Use `--help` for available commands and options

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.


## Usage

Use `npx @digdir/designsystemet` to create CSS for use with Designsystemet, based on a [config file](#using-a-config-file). It can also create type declarations and design tokens.

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
Set `cleanDir: true` on an output to delete the files in its directory before creating new ones, which removes any deprecated or unneeded files. It is `false` by default. Directories inside a cleaned directory that are built from (`tokensDir`), or that belong to an output with `cleanDir: false`, are kept. Before deleting anything, the CLI stops with an error if a directory it would clean contains the config file, is one of those directories, is a symlink, or has a symlink on the way to one of them or to another output. Symlinks are deleted, never followed.

> ⚠️ **WARNING** ⚠️  
> The design tokens created by this tool are considered an implementation detail, and are subject
> to change at any time without being considered a breaking change. Make your customisations through
> the config where you can. You can edit the design tokens directly to change what the config doesn't
> support yet, see [Sync Design Tokens with Tokens Studio](https://designsystemet.no/en/fundamentals/figma/tokens-studio),
> but you do so at your own risk: your edits may need to be redone or adjusted when you upgrade.
>
> The CSS files created by this tool are considered build artifacts. They should **not** be
> edited directly. While the CSS will not change unexpectedly, new variables may be added at any
> time.
>
> Therefore, it is necessary to routinely re-run this command when upgrading the libraries.
> Creating the design tokens again replaces any direct edits to them, and creating the CSS again
> replaces any direct edits to it.

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
To generate the CSS, you would then run:

```
npx @digdir/designsystemet
```

This creates CSS in `designsystemet`, relative to the config file, directly from the themes. Add `"types"` to `output` to also create type declarations, and `"design-tokens"` to also save the design tokens.

#### Output

Use `output` to choose what is created and where. Each item is either an output type (`"design-tokens"`, `"css"` or `"types"`) using its default settings, or an object:

```jsonc
{
  "output": [
    // defaults: dir "designsystemet/design-tokens", cleanDir false
    { "type": "design-tokens", "dir": "../path/to/design-tokens" },
    // defaults: dir "designsystemet", tokensDir from the design-tokens output, cleanDir false, tailwind false
    { "type": "css", "dir": "../path/to/css", "tokensDir": "../path/to/design-tokens" },
    // defaults: dir "designsystemet", tokensDir from the design-tokens output, cleanDir false
    { "type": "types", "dir": "../path/to/types", "tokensDir": "../path/to/design-tokens" },
  ],
}
```

Design tokens are always created first, then CSS, then types. If `tokensDir` is not set, CSS and types are built from the `dir` of the `design-tokens` output.

The `types` output writes `types.d.ts` (and the deprecated `colors.d.ts`), which augment `@digdir/designsystemet-types` with your theme's color names.

Without a `design-tokens` output or `tokensDir`, CSS and types are created directly from the themes, without writing any design tokens. The default, `"output": ["css"]`, creates only CSS this way.

`themes` is only needed by outputs that are created from themes. To build CSS and types from existing design tokens, leave out `themes` and set `tokensDir`:

```jsonc
{
  "output": [
    { "type": "css", "tokensDir": "./design-tokens" },
    { "type": "types", "tokensDir": "./design-tokens" },
  ],
}
```

Set `tailwind` on the `css` output to `"v4"` or `"v3"` to also create a `<theme>.tailwind.css` for that Tailwind version. By default (`false`) no Tailwind file is created.

The `outDir` and `clean` fields are deprecated in favour of `output`. The CLI will offer to migrate your config file automatically.

#### Complex config example

Have a look at the `*.config.json` files under the `packages/cli` in the Github repo for more complex examples.

#### Create config from existing tokens

You can get a minimal config file, meaning without overrides, generated from existing design tokens using the following command:

```sh
npx @digdir/designsystemet generate-config-from-tokens --dir <path to design tokens> --out <path to config file>
```

`--out` defaults to `designsystemet.config.json`. The generated config uses `output`, with the design tokens directory written relative to the config file. CSS and types are saved in `design-tokens-build` in the directory the command was run from, where `tokens build` saved them.
