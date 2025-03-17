# @digdir/designsystemet

CLI and tooling for Designsystemet

Use `--help` for available commands and options

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.


## Usage

### Create tokens

Use `npx @digdir/designsystemet tokens create <options>` to create design tokens for use with Designsystemet.

This allows you to define themes including custom colors, font-family, and border-radius.
We recommend using the [Designsystemet theme builder](https://theme.designsystemet.no/) for generating a valid command with correct options.

#### Update tokens

Whenever a new version of the CLI is released, or you have done changes, we recommend to update design tokens with the `--clean` option to potentially remove any changes deprecated files or unneeded files.

To update design tokens, re-run `npx @digdir/designsystemet tokens create <options> --clean`. 
If a [config file](#using-a-config-file) you can also re-run with `"clean": true`.

> ⚠️ **WARNING** ⚠️  
> The design tokens created by this tool are considered an implementation detail, and is subject
> to change at any time without being considered a breaking change. We **only** support customisations
> done through the CLI options. Direct editing of the design tokens are **not** supported.
> 
> Since tokens may be added or removed at any time, it is necessary to routinely re-run this
> command when upgrading the libraries. This will remove any direct edits to the design tokens.

### Build CSS from tokens

Use `npx @digdir/designsystemet tokens build <options>` to build CSS from design tokens generated in the previous step.

> ⚠️ **WARNING** ⚠️  
> The CSS files from created by this tool are considered build artifacts. They should **not** be
> edited directly. While the CSS will not change unexpectedly, new variables may be added at any
> time. Therefore, it is necessary to routinely re-run this command when upgrading the libraries.
> This will remove any direct edits to the CSS.

#### Update built CSS

Whenever a new version of the CLI is released, or you have done changes, we recommend to build a new set of CSS from design tokens with the `--clean` option to potentially remove any changes deprecated files or unneeded files.


### Using a config file

> ⚠️ **WARNING** ⚠️  
> This feature is experimental. The config schema may change at any time.


The `tokens create` command supports a config file. It will auto-detect a `designsystemet.config.json` file in the current directory. You can also use the `--config <path>` option to supply a different config name and location.

The main advantage of using a config file is for automation in scenarios with multiple themes.

To get started, use this template for a `designsystemet.config.json` file:

```jsonc
{
  "$schema": "node_modules/@digdir/designsystemet/dist/config.schema.json",
}
```

In editors which support JSON Schema, the `$schema` will then  give you editor hints for the structure of the file.

#### Minimal config example
As a minimal example, the following CLI snippet from the theme builder

```
npx @digdir/designsystemet tokens create \
--main-colors "primary:#0062BA" "accent:#1E98F5" \
--neutral-color "#1E2B3C" \
--support-colors "extra1:#F45F63" "extra2:#E5AA20" \
--border-radius 4 \
--theme "theme"
```

...is equivalent to this `designsystemet.config.json` file
```jsonc
{
  "$schema": "./node_modules/@digdir/designsystemet/dist/config.schema.json",
  "outDir": "../path/to/design-tokens",
  "themes": {
    "theme": {
      "colors": {
        "main": { "primary": "#0062BA", "accent": "#1E98F5" },
        "neutral": "#1E2B3C",
        "support": { "extra1": "#F45F63", "extra2": "#E5AA20" }
      },
      "borderRadius": 4
    }
  }
}
```
To generate new design tokens and CSS files, you would then run.

```
npx @digdir/designsystemet tokens create
npx @digdir/designsystemet tokens build
```

#### Complex config example

Have a look at the `*.config.json` files under the `packages/cli` in the Github repo for more complex examples.
