---

name: cli-generated-files
description: Regenerate the committed files that come from the CLI. Use after changing anything under packages/cli/src (colors, tokens, schemas, figma), designsystemet.config.json or internal/digdir/digdir.config.json.
---

# Regenerate the files the CLI generates

Several generated files are committed, and CI does not check that they are up to date. After a change to the CLI's colors, tokens or schemas, run these from the repo root, in this order, and include the resulting diff in the same pull request.

1. `pnpm build:cli`
   - The apps and the Figma plugin use the CLI's built `dist`, not its source, so build first.
   - Also rewrites `packages/cli/docs/designsystemet.config.defaults.json`.
2. `pnpm update:theme`
   - Rewrites `packages/css/theme/` (`designsystemet.css`, `designsystemet.tailwind.css`, `types.d.ts`, `colors.d.ts`) and `internal/digdir/themes/`.
3. `pnpm test:cli`
   - Rewrites the fixtures in `packages/cli/tests/config/design-tokens/` and `packages/cli/tests/config/build/`.
4. `pnpm update:preview-tokens`
   - Only when sizes, typography, colors or semantic tokens change. Rewrites `internal/components/src/tokens/design-tokens/`, which the token tables in the docs use.

If a step gives no diff, there is nothing to commit for it. A diff you did not expect means the change affects more output than intended; look at it before committing.

## Config schema changes

- The JSON schema is a snapshot: `packages/cli/src/schemas/__snapshots__/config.schema.json`. The unit tests fail when it differs. Update it on purpose with `pnpm --filter @digdir/designsystemet test:unit -u`.
- A breaking change to the shape of the config needs a migration in `packages/cli/src/migrations/`, registered in `index.ts`.
- Do not edit `apps/www/app/content/schemas/config/*.json` by hand. They are copied from the CLI at release.
