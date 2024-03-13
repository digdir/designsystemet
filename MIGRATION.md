<h1>Migration</h1>

- [React](#react)
  - [From version \< 0.52.x to 0.53.0](#from-version--052x-to-0530)
    - [Changed package structure \& names](#changed-package-structure--names)
    - [New setup](#new-setup)

## React

### From version < 0.52.x to 0.53.0

#### Changed package structure & names

New package structure & names to be better signalize intended use, along with;

- Support tree-shaking
- Headless components
- Server side rendering
- Easier to override themes using theme builder
- Support planned future features and packages

Renamed & new packages:

| Old                            | New                            |
| ------------------------------ | ------------------------------ |
| `@digdir/design-system-react`  | `@digdir/designsystemet-react` |
| `@digdir/design-system-tokens` | `@digdir/designsystemet-theme` |
|                                | `@digdir/designsystemet-css`   |

#### New setup

The styling for all components have now be extracted into a separate packages.

`@digdir/designsystemet-theme` and `@digdir/designsystemet-css`, now has to be imported to get Designsystemet styling for components.

The new setup for using React components with Designsystemet styling is now:

```jsx
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

import { Button } from '@digdir/designsystemet-react';

<Button variant='secondary'>I am a button!</Button>;
```

`@digdir/designsystemet-theme` and `@digdir/designsystemet-css` only needs to be imported once.
