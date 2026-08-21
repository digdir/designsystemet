# The twin system: what each file is, and who maintains what

The short version: **the repo commits 6 files; everything else is build output.**
A twin is the machine-readable contract of one component or pattern, served to
AI agents so they look facts up instead of guessing them.

## Files, one by one

| File | What it is | Generated or maintained? |
|---|---|---|
| `scripts/generate-twins.mjs` | Reads component source and writes one contract per documented export (import name, emitted attributes, tokens, JSDoc) | Maintained (a script, changes rarely) |
| `scripts/merge-authored-twins.mjs` | Merges the authored rules into the generated twins; `--verify` rechecks every quote against the live docs | Maintained (a script, changes rarely) |
| `scripts/twins-authored.json` | **The one content file**: accessibility, relations and composition rules for 44 components, each backed by a verbatim docs quote and a review record | Maintained, but only when the docs change (see below) |
| `scripts/twin-patterns/*.json` (3) | Pattern contracts (form validation, required/optional marking, field guidance): how components compose into a correct whole | Maintained, same rhythm as the docs pages they mirror |
| `registry/**` (~90 files) | The generated output: one JSON per component, one per pattern, plus `llms.txt` | **Generated. Never committed, never edited.** Like `dist/`, it is gitignored and rebuilt by `pnpm generate:twins && pnpm merge:twins` |
| `registry/REVIEW.md` | Worklist produced by `--verify`: only the rules whose quote no longer appears on the cited page | Generated |
| `apps/www/public/twins/**`, `public/llms.txt` | The same generated output, placed where the site serves it (built by `pnpm twins` in the www build) | Generated, gitignored |

## What maintenance actually looks like

- **A component's code changes** (props, tokens, class names): nothing to do.
  The extracted layer regenerates from source on the next build and cannot
  drift from it.
- **A docs page changes**: run `pnpm merge:twins --verify` (or let a scheduled
  job run it). It fetches every cited page, rechecks every quote, and writes a
  review sheet listing *only* the affected rules. A human answers one question
  per row: does the current text still support the rule? Observed rates so
  far: an ordinary docs deploy produced 4 rows (~2 minutes); a full
  restructure of three component pages produced 51 rows (~30 minutes).
- **A new component is added**: give its export a JSDoc block and it gets a
  twin automatically. Authored rules for it are optional and can land whenever
  someone writes them; the generator never invents them in the meantime.

There is no per-component upkeep, no parallel documentation to keep in sync,
and no file anyone edits by hand except `twins-authored.json` and the three
pattern files, on the docs' own change rhythm.
