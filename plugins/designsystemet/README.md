# Designsystemet Figma plugin

Imports a Designsystemet config, e.g. from [the theme builder](https://theme.designsystemet.no), into a Figma file as variable collections, variables, text styles and effect styles.

[Design of the plugin in Figma](https://www.figma.com/design/trNNkbj9vNueZ8wRXjYpnh/Figma-Plugin?node-id=9-46&t=KRKRa4lkcS2rsFAl-1)

## What an import does

An import makes the file match the config:

- Creates the collections, modes, variables, text styles and effect styles in the config, and updates the ones that already exist, matched by name.
- Only writes what has changed, so importing the same config again changes nothing.
- Deletes modes, variables and styles from earlier imports that are no longer in the config. What the import creates is marked with plugin data, so modes, variables and styles added by hand are kept (see [ownership.ts](./src/plugin/import/ownership.ts)).
- Leaves other collections and styles alone.

After the import, the plugin shows what it did, what it skipped, and how long each step took.

The plugin explains this to users in [the about view](./src/ui/views/about.tsx). Keep the two in sync.

### Limitations

- Each theme, color scheme and size is a mode, and Figma limits how many modes a collection can have depending on the plan.
- Text and effect styles can't have modes, so they get the values of the first theme, in the light color scheme.
- The fonts in the config must be available in Figma. The import stops before writing anything if one isn't.

### Features that are turned off

- **Export:** creates a config from the variables and styles in the file. Set `START_VIEW` to `'home'` in [app.tsx](./src/ui/app.tsx) to choose between import and export when the plugin opens.
- **Import from CSS:** creates a config from theme CSS built by Designsystemet, e.g. `designsystemet.css`. Set `FEAT_CSS_IMPORT` to `true` in [import.tsx](./src/ui/views/import.tsx).

## Development

Build the plugin and rebuild it on changes, from the root of the repository:

```sh
pnpm watch:plugin
```

Then load it in the Figma desktop app: **Plugins → Development → Import plugin from manifest…**, and choose [manifest.json](./manifest.json) in this folder. Figma uses the files in `dist`, so run the plugin again after a rebuild to get the changes.

Other scripts, run in this folder:

| Script | Does |
| --- | --- |
| `pnpm build` | Builds the plugin to `dist` |
| `pnpm test` | Runs the tests |
| `pnpm types` | Type checks |
| `pnpm zip` | Builds the plugin and zips it with the manifest, as `designsystemet-figma-plugin.zip` |

### Code

- [src/plugin](./src/plugin): runs in Figma and reads and writes the file. [code.ts](./src/plugin/code.ts) handles the messages from the UI.
  - [import](./src/plugin/import): builds tokens from the config with the CLI, and writes them to the file.
  - [export](./src/plugin/export): reads the file and creates a config.
- [src/ui](./src/ui): the plugin window, in React with Designsystemet. It's built into one HTML file, as Figma requires.
- [src/types.ts](./src/types.ts): the messages between the UI and the plugin.

## Testing in Figma

Import a config into an empty file, and into a file that has had an earlier import. The configs in the root of the repository, e.g. [designsystemet.config.json](../../designsystemet.config.json), work for this. Then check:

1. **Variables:** all collections and modes are there, and no variable refers to one that's missing.
2. **Scopes:** draw a rectangle. The semantic color variables are suggested for the fill, and the border radius variables for the corner radius.
3. **Text styles:** every typography style is there, and its font family, font weight and font size are bound to variables.
4. **Effect styles:** every shadow is there.
5. **Code syntax:** edit a variable in the Semantic collection. Its code syntax for Web is the CSS variable, e.g. `var(--ds-color-background-default)`.
6. **Importing again:** import the same config again. The import log says "No changes", and Timings says no variable values were written.
