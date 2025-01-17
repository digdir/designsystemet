# @digdir/designsystemet-theme

This package contains the following predefined Designsystemet themes for use in Digdir.

- `digdir`
- `altinn`
- `uutilsynet`
- `portal`

Build your own theme on https://theme.designsystemet.no/

## Usage

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.

When importing the package make sure to specify which theme. 
By default `digdir` is used.

```tsx
import '@digdir/designsystemet-theme/<theme>.css';

// Digdir theme
import '@digdir/designsystemet-theme';

// Altinn theme
import '@digdir/designsystemet-theme/altinn.css';
```

### CSS

This package adds Designsystemet [css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to your `:root {}`.
You only need to import this once in your application, preferably somewhere in your "root" html.

All variables are prefixed with `ds`.

```js
import '@digdir/designsystemet-theme/altinn.css';
```

```css
div {
  padding: var(--ds-size-1);
}
```

