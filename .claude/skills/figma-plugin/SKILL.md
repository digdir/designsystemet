---

name: figma-plugin
description: Rules for the Figma plugin and for changes that show up in Figma. Use when changing anything in figma/plugin or packages/cli/src/figma, or when a CLI or CSS change alters Figma variables or which variables components use.
---

# Working on the Figma plugin

Building, loading and testing the plugin is described in `figma/plugin/README.md`. This file has what the README does not say.

## Before you start

- The plugin uses the CLI's built `dist`. `pnpm build:plugin` builds the CLI too, but `pnpm watch:plugin` does not. After a change in `packages/cli`, run `pnpm build:cli` again.

## Code that runs in Figma (`src/plugin`)

- Use only the async Figma getters, e.g. `getLocalVariablesAsync`. The manifest has `documentAccess: dynamic-page`, so the sync ones throw.
- A long loop must call the pause from `import/pause.ts`, so Figma can repaint and does not freeze.
- A new import step needs an `onStep()` call and a higher `IMPORT_STEPS` in `import/import-to-figma.ts`. The progress bar is counted from it.
- Mark everything the import creates with the helpers in `import/ownership.ts`. A later import only deletes what is marked, so the user's own variables and styles are kept. Add fields to the stored data; never rename them.
- Find collections with `FIGMA_COLLECTION` from the CLI, not with the names written out.
- The plugin has no network access (`networkAccess: none`).

## Messages between the UI and the plugin

- Add every new message to the `FigmaMessages` union in `src/types.ts`.
- Messages to the UI are type checked. Messages from the UI are not: `postToPlugin` takes any payload, so check its fields against the type by hand.

## Testing

- Unit tests fake the `figma` global with `vi.stubGlobal`; see `import/variable-sync.test.ts`.
- Then go through "Testing in Figma" in `figma/plugin/README.md`. The tests do not cover what Figma itself does.

## Changesets for Figma

- A change to the plugin needs a `figma-plugin` changeset.
- A CLI or CSS change that alters variables, their values, or which variables the components use, also needs a `figma-ui-kit` changeset in the same pull request. This is the one that gets forgotten.
- Write it for designers: use Figma's words (variables, modes), and say what they must do in their own copy of the UI kit, if anything.
- How to write and publish them is in `figma/README.md`.
