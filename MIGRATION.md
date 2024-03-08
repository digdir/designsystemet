<h1>Migration</h1>

- [React](#react)
  - [From version 0.52.x to 0.60.0](#from-version-052x-to-0600)
    - [Changed package structure \& names](#changed-package-structure--names)
    - [New setup](#new-setup)

## React

### From version 0.52.x to 0.60.0

#### Changed package structure & names

New package structure & names to be better signalize intended use and support tree-shaking, headless components, server side rendering and planned future packages & implementations.

Renamed & new packages:

| Old                            | New                            |
| ------------------------------ | ------------------------------ |
| `@digdir/design-system-react`  | `@digdir/designsystemet-react` |
| `@digdir/design-system-tokens` | `@digdir/designsystemet-theme` |
|                                | `@digdir/designsystemet-css`   |

#### New setup

The styling for all components have now be extracted into a separate package, `@digdir/designsystemet-css`, which is now need to import to get correct styling for components.

The new setup for using React components is now:

```jsx
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

import { Button } from '@digdir/designsystemet-react';

<Button variant='secondary'>I am a button!</Button>;
```

`@digdir/designsystemet-tokens` and `@digdir/designsystemet-css` only needs to be imported once.
