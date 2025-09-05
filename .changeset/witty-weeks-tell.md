---
"@digdir/designsystemet-react": minor
"@digdir/designsystemet-theme": minor
"@digdir/designsystemet": minor
"@digdir/designsystemet-css": minor
---
Sizing and size modes have been reimplemented align code and Figma implementations, and to support setting size mode in css queries.

`--ds-size-*` variables are now independent of the element's font size, and only depend on the size mode, which aligns the code implementation with how the modes already worked in Figma. **Important**: This will have a large visual impact on existing code where size variables have been used to style Heading elements (e.g. margin).

Read [Sizes in code](https://www.designsystemet.no/en/fundamentals/code/sizes) for info on how size modes work after these changes.
