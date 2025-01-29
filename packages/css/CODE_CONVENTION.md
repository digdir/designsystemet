# CSS Code Convention

## Naming and classes
- To the best of our abilities, use only one class
- Use DOM structure and attributes to target other elements
- Use `ds-` prefix for all classes
- Use kebab-case for class names

## CSS Properties
- Use `var(--ds-color-X)` where we want `data-color` to cascade
- Only use `background` not `background-color`
- Avoid using shorthands (`font:`, `border:`)
- Avoid `position: relative` and change of display unless necessary
- Avoid set sizes, such as `100px`, use `var(--ds-size-X)` or `var(--ds-font-size-X)` instead
  - If our custom properties don't work, try to use `em`
- Use `--ds-{COMPONENT}-{PROPERTY}` prefix for custom properties
  - Avoid reassigning
  - Use the word `spacing` when we use it to do more than just set a property. For example in `padding`, but also in a calc for `margin-inline`
  - States should be in this pattern: `--ds-{COMPONENT}-{PROPERTY}--{STATE}`

## Structure
- Custom properties should be set in the root element
- Properties should come right after the custom properties
- Use CSS nesting

## Other
- Icons should be data-uri encoded, and set in custom properties ending in `-icon`
  - We place the icons using pseudo elements with `mask`
- When using duplicate code, try to use `@composes`
- When a certain DOM structure is needed, target for this structure. It should break if another structure is used.
- Use `@media(hover: hover) and (pointer: fine)` to only get hover on devices that benefit from it
