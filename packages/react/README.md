# @digdir/designsystemet-react

React implementation of the Designsystemet components

- Uses `@digdir/designsystemet-css` for styling.
- Use this with your theme CSS file generated with `npx @digdir/designsystemet`. 
  - Build your own theme on https://theme.designsystemet.no/en
  - Alternative you can use the default starter theme under  `@digdir/designsystemet-css/theme`.
- All components support `ref`.
- All components support SSR.
  - Use full component name, e.g. `CardBlock` instead of `Card.Block`
- Most components extend and behave as native html-elements.
- Most components support composition and `asChild` for overriding the underlying html-element.

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.
