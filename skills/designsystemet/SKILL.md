---
name: designsystemet
description: "Build and customize interfaces with Designsystemet. Use when choosing, installing, implementing, styling, or troubleshooting Designsystemet components, themes, CSS, or design tokens."
---

# Designsystemet

Use this skill when building a product with Designsystemet. Prefer its documented
components, patterns, and theme tokens over recreating them. The canonical
documentation index is [llms.txt](https://designsystemet.no/llms.txt); documentation
pages are also available as Markdown by appending `.md` to the URL.

## Workflow

1. Inspect the project's framework, installed Designsystemet packages and versions,
   existing CSS imports, theme files, and configuration before changing anything.
2. Read the relevant [component overview](https://designsystemet.no/en/components)
   and pattern documentation. Use the docs for the installed version; do not guess
   component props or assume an API from another version.
3. Use the package that matches the project:
   - React: `@digdir/designsystemet-react` with `@digdir/designsystemet-css`.
   - HTML or another framework: `@digdir/designsystemet-web` with
     `@digdir/designsystemet-css`.
   - CSS alone is an option only when the project implements the required behaviour
     itself.
4. Follow the [setup guide](https://designsystemet.no/en/fundamentals/code/setup.md)
   for imports, framework-specific usage, and TypeScript configuration. Preserve
   existing package versions and project conventions unless an upgrade is requested.
5. Validate with the project's existing checks. For interactive components, also
   verify their keyboard operation, focus, and state changes in a real browser;
   DOM emulators do not cover all browser behaviour.

## Choose components by purpose

Read each component's overview before using it. In particular:

- Use a [Button](https://designsystemet.no/en/components/docs/button/overview.md)
  for an action or state change, such as saving, submitting, or opening a dialog.
  Use a [Link](https://designsystemet.no/en/components/docs/link/overview.md) for
  navigation, even when it is styled to look like a button. Choose the HTML element
  based on what it does, not how it looks.
- Use a [Chip](https://designsystemet.no/en/components/docs/chip/overview.md) for
  interactive filters and active filters, not for navigation or static categories.
  Use a Badge for status or counts and a Tag for non-interactive labels.
- Use [Field](https://designsystemet.no/en/components/docs/field/overview.md) to
  associate a form control with its label, description, validation message, and
  character count. Use Fieldset to group related fields.
- Prefer the library's component and documented composition pattern over a custom
  substitute. Check the component's accessibility guidance and preserve its
  semantic role, accessible name, and native behaviour.

## Themes and CSS

- Treat theme CSS as generated output. Do not hand-edit `theme.css`, a generated
  theme file, or generated design tokens: regenerate them from the project's
  `designsystemet.config.json` using the documented CLI workflow.
- Do not redefine Designsystemet's generated tokens or component styles inside the
  generated theme file. For a product-specific exception, use an app-owned
  stylesheet and keep the override small and local.
- Prefer the supported theme configuration and tokens, or the documented
  `data-color`, `data-color-scheme`, `data-size`, and `data-typography` attributes,
  over hard-coded values. Check the project's theme for available colors and token
  types.
- Import Designsystemet CSS before the theme CSS so its cascade-layer order is set
  first. Follow the [CSS guide](https://designsystemet.no/en/fundamentals/code/css.md)
  when using a reset, Tailwind, or app-specific overrides.
- `data-color-scheme` can reset color values set by `data-color`; when changing the
  color scheme, set `data-color` on that element too if the non-default color
  should remain.
- For a custom theme, use the [theme guide](https://designsystemet.no/en/fundamentals/start-here/own-theme.md)
  and [colors in code](https://designsystemet.no/en/fundamentals/code/colors.md)
  rather than manually editing generated variables.

## React composition

Use `asChild` only when the documented component supports it and a different
underlying element is needed. It accepts one child element. The child must forward
the props and ref it receives; verify that the final DOM element still has the
correct semantics and accessibility.

## When changing Designsystemet's own component source

These are contributor conventions, not requirements for projects consuming the
published packages. Follow the
[coding conventions](https://github.com/digdir/designsystemet/wiki/Coding-conventions)
and nearby components. In particular:

- Preserve refs and native HTML props, and keep public prop names consistent.
- Prefer a variant or compound-component API over another overlapping component.
- Use `useId()` where generated IDs are needed for accessibility.
- Use `:focus-visible` for keyboard focus and gate hover-only styling with
  `@media (hover: hover) and (pointer: fine)`.
- Follow the repository's CSS token naming and custom-property conventions instead
  of introducing aliases or new global overrides.
