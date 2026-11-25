# Designsystemet Figma plugin

Imports a Designsystemet config, e.g. from [the theme builder](https://theme.designsystemet.no), into a Figma file as variable collections, variables, text styles and effect styles.

## What an import does

An import makes the file match the config:

- Creates the collections, modes, variables, text styles and effect styles in the config, and updates the ones that already exist, matched by name.
- Only writes what has changed, so importing the same config again changes nothing.
- Deletes modes, variables and styles from earlier imports that are no longer in the config. What the import creates is marked with plugin data, so items added by hand are kept unless an import adopts them by updating an item with a matching name; items renamed or duplicated after an import are also kept (see [ownership.ts](./src/plugin/import/ownership.ts)).
- Leaves other collections and styles alone.

After the import, the plugin shows what it did, what it skipped, and how long each step took.

The plugin explains this to users in [the about view](./src/ui/views/about.tsx). Keep the two in sync.

### Limitations

- Each theme, color scheme and size is a mode, and Figma limits how many modes a collection can have depending on the plan.
- Text and effect styles can't have modes, so they get the values of the first theme, in the light color scheme.
- The fonts in the config must be available in Figma. The import stops before writing anything if one isn't.

## Migrations

When a release changes which variables the UI kit's components use, users with their own copy of the UI kit need their layers updated too. An import can't do this, as it only updates variables and styles. A migration does: **Update UI kit** in the plugin lists the migrations, the user chooses which to run, sees a summary of what will change in each component, and then applies them. Undo in Figma takes back all of it at once. The file records which migrations were applied, and when.

A migration finds the UI kit's components by page and name (see [Finding the UI kit's pages](#finding-the-ui-kits-pages)), and rebinds the color variables on their layers by rules (see [rebind.ts](./src/plugin/migrate/rebind.ts)). It changes main components first. Layers in instances of those components follow them, so only their overrides are changed there. Layers in instances of other components, e.g. text from Typography in Dialog, are changed in place, which overrides them in that component.

What a migration leaves alone, which the plugin and the changeset tell users:

- Components and layers the user made outside the UI kit's components, even if they use the same variables.
- Colors the user overrode on instances of the UI kit's components, in their own designs.
- UI kit components that are renamed or moved to another page, in a copy made before the UI kit was stamped. They aren't found, and the summary says so. Renamed pages are found by the components on them.

Layers the user added inside a UI kit component are changed, as the rules apply to every layer in it.

To add a migration:

1. Write it in [src/plugin/migrate/migrations](./src/plugin/migrate/migrations), like [muted-colors.ts](./src/plugin/migrate/migrations/muted-colors.ts): the components to change, the rules, and the variables a config must have added first (`requires`). Give it an `id` that never changes.
2. Add it at the end of `MIGRATIONS` in [run-migrations.ts](./src/plugin/migrate/run-migrations.ts).
3. Test the rules, and run it on a copy of the UI kit from before the change. Compare the result with the updated UI kit.
4. Run it on a file with the user's own work too: a component of their own, a layer they added inside a UI kit component, and an instance with a color they changed. Check that only the second one changes.

### Finding the UI kit's pages

People may rename pages and components in their copy of the UI kit. A migration looks for each page in this order:

1. The page stamped with the migration's page name, e.g. `Dialog`.
2. The page with that name, ignoring the symbols in front, e.g. `❖  Dialog`.
3. The page with the most of that page's components, if it has at least half of them, and one that no other page in the migration lists. `_Header` is on both the Dialog and Card pages, so it can't find a page on its own. This loads the pages not found by 1 or 2, so it's only done when a page is missing.

On a page, a component is found by its stamp, or else by its name. When a page has another name than the migration's, the summary says so, e.g. "Dialog (page ‘Modal’)".

Stamps are shared plugin data on the pages and components of the UI kit's source file ([stamps.ts](./src/plugin/stamps/stamps.ts)). They're copied with a duplicated file, so copies made after stamping are found even if both pages and components are renamed. A stamp only counts on the page or component it was made for, by its ID: duplicating a file keeps the IDs, but a page or component duplicated within a file gets a new one, so people's own copies aren't taken for the UI kit's. Before a release of the UI kit, stamp the source file: set `FEAT_STAMP_UI_KIT` to `true` in [app.tsx](./src/ui/app.tsx), run the plugin in the source file, and choose **Stamp UI kit** under **For maintainers** on the start page. It stamps the pages and components that don't have a stamp yet, and keeps existing stamps, so they stay the same when a page or component is renamed later. A migration lists its components by their stamps.

| Migration | What it does |
| --- | --- |
| `muted-colors` | Components no longer use the neutral color: borders, read-only fields and secondary text use the muted colors, and the rest the component's own color ([#5351](https://github.com/digdir/designsystemet/issues/5351)). |

### Features that are turned off

- **Stamp UI kit:** for maintainers, see [Finding the UI kit's pages](#finding-the-ui-kits-pages). Set `FEAT_STAMP_UI_KIT` to `true` in [app.tsx](./src/ui/app.tsx).
- **Export:** creates a config from the variables and styles in the file. Set `FEAT_EXPORT` to `true` in [app.tsx](./src/ui/app.tsx) to show it as a utility on the start page.
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
  - [migrate](./src/plugin/migrate): updates the layers in a copy of the UI kit, see [Migrations](#migrations).
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
7. **Migrations:** in a copy of the UI kit from before a migration, import a config, click **Update UI kit**, and preview the migration. Check the summary, apply it, and compare the components with the updated UI kit. Preview it again: there's nothing to change.

## Versions and publishing

The plugin is versioned with the code packages and published to Figma Community together with the UI kit. See [the Figma README](../README.md) for how to document changes and publish a new version.
