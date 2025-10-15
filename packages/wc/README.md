> ⚠️ **WARNING** ⚠️  
> The web components created here are **not** meant to be used in production.
> This project only serves as a playground for us to test using web components for some of our react components.
> 
> If you are here because you don't want to use React, you should take a look at only using our CSS package: [@digdir/designsystemet-css](../css/README.md).

## Web Components

Most of our components are plain HTML elements, and these don't need any JavaScript to work.
However, some components need a bit of JavaScript to work properly.
These components include:
- Floating components (e.g. Popover, Tooltip, Dropdown)
- Field
- Components that need to manage focus or keyboard interaction (e.g. Tabs, ToggleGroup)
- Components that need JavaScript to be managed

## Current implementation
We have implemented this as simple as possible. No framework, but pure JS.
Rollup bundles it, and adds all dependencies (floating-ui) to the bundle, making for a single JS file.

Run `pnpm dev` to build and start a local server. It does not have hot reloading.
