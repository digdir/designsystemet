# React Code Convention

## Naming
- Component names should be in PascalCase

## Component Structure
- To the best of our abilities, use sub-components instead of a large components
- Use `forwardRef` for all components
  - Use named functions instead of arrow functions for the component
- If applicable, add support for `asChild`
- Should allow all props for the native element
  - Add native props to the outermost element
  - Custom props should have a jsdoc
- Only add one class name
  - Use data attributes to add states

## Functionality
- Only use context if it's absolutely necessary, or can lead to a better consumer experience


## Files
- Export components from an index file, avoiding the use of `export * from './Component'`
  - The root index file uses `export * from './Component'`
- Use `Object.assign` to make a compound component
  - Make sure to still export every individual component
- Stories and MDX files should be in the same directory as the component

## Storybook
- Don't use `argTypes` for documenting component props. Typescript types should be single source of truth for props.
- Add `.chromatic.tsx` and `createSingleStory` to opt-in for visual testing.
  - Interactive stories must enable visual testing with `{ chromatic: { disableSnapshot: false } }` in the `parameters` meta object
