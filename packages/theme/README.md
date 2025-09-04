# @digdir/designsystemet-theme

This package contains the following predefined Designsystemet themes for use in Digdir.

- `digdir`
- `altinn`
- `uutilsynet`
- `portal`
  
As well as a default theme used in the themebuilder.

Build your own theme on https://theme.designsystemet.no/

## Usage

Read the Designsystemet [README](https://github.com/digdir/designsystemet) to get started.

When importing the package make sure to specify which theme. 
By default a custom theme for the themebuilder is used.

```css
// Default theme
@import url('@digdir/designsystemet-theme');
// or 
@import url('@digdir/designsystemet-theme/<theme>.css');
```

### CSS

All variables are prefixed with `ds` and inside [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) `ds`.

```css
@import url('@digdir/designsystemet-theme/altinn.css');

@layer "other layers", ds;

.example {
  padding: var(--ds-size-1);
}
```

