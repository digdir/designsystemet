> ⚠️ **WARNING** ⚠️  
> This package is not fully released yet.
> It is still under development, and feedback is welcome.

## `@digdir/designsystemet-web`

### Get started

To get everything at once, you simply import the package:
```ts
import '@digdir/designsystemet-web';
```

This will register all web components and observers globally, so you only need to do this once.

#### Types
In you tsconfig, add:
```json
{
  "compilerOptions": {
    "types": ["@digdir/designsystemet-web"]
  }
}
```

### Warnings:

`@digdir/designsystemet-web` will warn you about deprecations and missing attributes.
This can come in handy while developing, but can also easily be hidden, for example in production:

```
if (typeof window !== 'undefined' && isProduction()) window.dsWarnings = false;
import `@digdir/designsystemet-web`;
```

### `ds-breadcrumbs`
Automatically hides/shows `aria-label` on desktop/mobile and `aria-current="page"` on last link in list. No API.

```html
<ds-breadcrumbs class="ds-breadcrumbs" aria-label="You are here:">
  <a href="#none" aria-label="Tilbake til Nivå 3">
    Nivå 3
  </a>
  <ol>
    <li><a href="#none">Nivå 1</a></li>
    <li><a href="#none">Nivå 2</a></li>
    <li><a href="#none">Nivå 3</a></li>
  </ol>
</ds-breadcrumbs>
```

### `details` and `summary`
Use native elements. We polyfill a bug in Firefox when combined with Android Talkback screen reader to announce state and role properly.

```html
<details class="ds-details">
  <summary>More info</summary>
  <div>Lorem ipsum dolor sit amet.</div>
</details>
```

### `dialog`
Use the native `<dialog>` element. We polyfill support for `closedby="any"`.

```html
<dialog class="ds-dialog" closedby="any" id="my-dialog">
my dialog
</dialog>
```

See [Polyfills](#polyfills) for how to open and close the dialog with commands.

### `ds-error-summary`
Automatically takes focus when visible and sets `aria-labelledby` to the first child heading. No API.

```html
<ds-errorsummary class="ds-error-summary">
  <h2>Oppsummering</h2>
  <ul>
    <li><a href="#none">Feil 1</a></li>
    <li><a href="#none">Feil 2</a></li>
    <li><a href="#none">Feil 3</a></li>
  </ul>
</ds-errorsummary>
```

### `ds-field`
Connects inputs, labels and error messages.

```html
<ds-field class="ds-field">
  <label>Label</label>
  <input type="text" placeholder="Placeholder" class="ds-input" />
  <div class="ds-validation-message" data-field="validation">
    Dette er ein feilmelding
  </div>
</ds-field>
```

#### Counter
You can add a counter to inputs and textareas by adding the `data-field="counter"` attribute to a `<p>` element inside a `ds-field`.

```html
<ds-field class="ds-field">
  <label>Label</label>
  <textarea class="ds-input"></textarea>
  <p data-field="counter" data-limit="20" data-over="%d tegn for mye" data-under="%d tegn igjen" data-hint="Maks %d tegn tillatt."></p>
</ds-field>
```

| attribute  | type   | default               | required |
|------------|--------|-----------------------|----------|
| data-limit | number | undefined             | true     |
| data-over  | string | %d tegn for mye       | false    |
| data-under | string | %d tegn igjen         | false    |

### `ds-pagination`
Implements pagination, fills buttons with text.
You can use both `<a>` and `<button>` elements inside the pagination.

If you don't pass any attributes you can implement your own logic for current page and total pages.

```html
<ds-pagination class="ds-pagination" aria-label="Bla i sider:" data-href="?page=%d" data-current="2" data-total="100">
  <ol>
    <li><a></a></li>
    <li><a></a></li>
    <li><a></a></li>
    <li><a></a></li>
  </ol>
</ds-pagination>
```

### `popover`
We use native popover functionality, but we attach an event listener that fixes placement of designsystem components.

```html
<button class="ds-button" popovertarget="popover">Open popover</button>
<div class="ds-popover" popover id="popover" data-placement="left">
  This is some popover content. It can be very long, but it will wrap and
  stay within the viewport.
</div>
```

| attribute     | type   | default    | required |
|---------------|--------|------------|----------|
| data-placement | string | top        | false    |
| data-overscroll | 'contain' | undefined | undefined       | false    |
| data-autoplacement | boolean | true          | false    |

**If you don't use the class `ds-popover` you need to add the CSS property `--_ds-floating` to the popover element.** This can be `top`, `bottom`, `left` or `right`.

### `ds-suggestion`
Extends `u-combobox` from u-elements. See u-elements for documentation:
[https://u-elements.github.io/u-elements/elements/u-combobox](https://u-elements.github.io/u-elements/elements/u-combobox)

### `ds-tabs`
Extends `u-tabs` from u-elements. See u-elements for documentation:
[https://u-elements.github.io/u-elements/elements/u-tabs](https://u-elements.github.io/u-elements/elements/u-tabs)

### `ds-toggle-group`
This is implemented differently from `ToggleGroup` in the react package.

An observer will look for `[data-toggle-group]` and add proper arrow navigation plus Enter-key support.

```html
<fieldset class="ds-toggle-group" data-toggle-group="Tekstjustering" data-variant="secondary">
  <label>
    <input type="radio" name="alignment-two" value="left" checked />
    Venstestilt
  </label>
  <label>
    <input type="radio" name="alignment-two" value="center" />
    Midtstilt
  </label>
  <label>
    <input type="radio" name="alignment-two" value="right" />
    Høyrestilt
  </label>
</fieldset>
```

### `data-tooltip`
Using a single element for rendering next to elements with `data-tooltip` attribute.
Also automatically sets `aria-label` or `aria-description` as needed.

```html
<button data-placement="left" data-tooltip="venstre" class="ds-button">venstre</button>
```

### Polyfills
We automatically attach [invokers-polyfill](https://www.npmjs.com/package/invokers-polyfill/v/0.5.2), which means that you get support for `command` and `commandfor`.