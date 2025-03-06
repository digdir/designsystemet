# @digdir/designsystemet-react

React implementation of the Designsystemet components

- Uses `@digdir/designsystemet-css` for styling.
- Uses `@digdir/designsystemet-theme` or CSS file generated from `@digdir/designsystemet tokens build` for theming.
  - Build your own theme on https://theme.designsystemet.no/
- All components support `ref`.
- All components support SSR.
  - Use full component name, e.g. `CardBlock` instead of `Card.Block`
- Most components extend and behave as native html-elements.
- Most components support composition and `asChild` for overriding the underlying html-element.

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.
