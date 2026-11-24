---

name: web
description: Rules for working on the web components in packages/web, so far that their tests must pass in Chromium, Firefox and WebKit. Use when changing or adding anything under packages/web, or when a test there fails in one browser only.
---

# Working on the web components (`packages/web`)

## Tests must pass in all three browsers

- A change is done when the test check on the pull request is green. It runs every test in Chromium, Firefox and WebKit; WebKit is how we test Safari.
- Before pushing, run the tests for what you changed in all three browsers, so a failure in one browser is not first found in CI. You don't need to run the whole suite locally.
- Don't call a change tested in all three browsers from a local Chromium run. Say what you ran, and check the result of the check with `gh pr checks`.
- `packages/web/vitest.config.ts` runs every test five times: in the three browsers (the `Playwright` project), and in `JSDOM` and `Happy DOM`. CI runs all of them and fails if one does; see `.github/workflows/test.yml`.
- Don't make a test pass by skipping a browser or loosening what it checks. If the browsers behave differently, the component must handle it, or the difference is a bug to report.

## Running them locally

- `pnpm test:web --run <name>` runs the test files whose path has `<name>`, e.g. `popover`. Without a name it runs everything; without `--run` it watches.
- The browsers must be installed first: `pnpm exec playwright install chromium firefox webkit`.
- Each Playwright version needs its own browser builds. If a run fails with "Executable doesn't exist", Playwright has been updated: run the install again. It is not a failing test.
- For one browser: `pnpm test:web --run --project Playwright --browser=firefox`.

## Tests that need a real browser

- JSDOM and Happy DOM lack things like layout, focus handling and popovers. A test that needs them is marked so it only runs in the browsers:
  - a whole file is named `<name>.browser.test.ts`
  - a single test gets `tags: ['browser']`
- Mark only what needs it. A test that can run in JSDOM and Happy DOM should, as they are much faster.
