> ⚠️ **WARNING** ⚠️  
> This package is not fully released yet.
> It is still under development, and feedback is welcome.

## `@digdir/designsystemet-web`

### Types
We have simple types for our web components that can be used in TypeScript projects.
Types should be automatically included when you install the package.

We **do not** have types from frameworks yet. 
If you wish to use web components in react, you need to add this:

```ts
declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'ds-tabs': DSTabsElement;
      'ds-tablist': DSTabListElement;
      'ds-tab': DSTabElement;
      'ds-tabpanel': DSTabPanelElement;
      'ds-breadcrumbs': DSBreadcrumbsElement;
      'ds-error-summary': DSErrorSummaryElement;
      'ds-pagination': DSPaginationElement;
      'ds-suggestion': DSSuggestionElement;
      'ds-field': DSFieldElement;
    }
  }
}
```

### Get started

To get everything at once, you simply import the package:
```ts
import '@digdir/designsystemet-web';
```

This will register all web components and observers globally, so you only need to do this once.

### `ds-breadcrumbs`
Only implements basic functionality. No API.

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

### `ds-error-summary`
Only implements basic functionality. No API.

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
| data-limit | number | undefined             | false    |
| data-over  | string | %d tegn for mye       | false    |
| data-under | string | %d tegn igjen         | false    |
| data-hint  | string | Maks %d tegn tillatt. | false    |

### `ds-pagination`
Implements pagination, fills buttons with text.
You can use both `<a>` and `<button>` elements inside the pagination.

If you don't pass any attributes you can implement your own logic for current page and total pages.

```html
<ds-pagination class="ds-pagination" aria-label="Bla i sider:" data-href="?page=$page" data-current="2" data-total="100">
  <ol>
    <li><a href="#none"></a></li>
    <li><a href="#none"></a></li>
    <li><a href="#none"></a></li>
    <li><a href="#none"></a></li>
  </ol>
</ds-pagination>
```

### popover
We use native popover functionality, but we attach an observer that places the popover where you want it.

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
See u-elements for documentation:
[https://u-elements.github.io/u-elements/elements/u-combobox](https://u-elements.github.io/u-elements/elements/u-combobox)

### `ds-tabs`
See u-elements for documentation:
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
