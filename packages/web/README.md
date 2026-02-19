## `@digdir/designsystemet-web`

### Get started

We recommend to import the whole package.
This will register all web components and observers globally, so you only need to do this once.
```ts
import '@digdir/designsystemet-web';
```
#### Types
Add the package to your `types` for types:
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
import `@digdir/designsystemet-web`;
if (typeof window !== 'undefined' && isProduction()) window.dsWarnings = false;
```



## `<ds-breadcrumbs>`
Automatically hides/shows `aria-label` on desktop/mobile and `aria-current="page"` on last link in list. No API.

```html
<ds-breadcrumbs class="ds-breadcrumbs" aria-label="You are here:">
  <a href="#none" aria-label="Back to level 3">
    Level 3
  </a>
  <ol>
    <li><a href="#none">Level 1</a></li>
    <li><a href="#none">Level 2</a></li>
    <li><a href="#none">Level 3</a></li>
  </ol>
</ds-breadcrumbs>
```

## `<ds-error-summary>`
Automatically takes focus when visible and sets `aria-labelledby` to the first child heading. No API.

```html
<ds-error-summary class="ds-error-summary">
  <h2>Summary</h2>
  <ul>
    <li><a href="#none">Error 1</a></li>
    <li><a href="#none">Error 2</a></li>
    <li><a href="#none">Error 3</a></li>
  </ul>
</ds-error-summary>
```

## `<ds-field>`
Connects inputs, labels and error messages.

```html
<ds-field class="ds-field">
  <label>Label</label>
  <input type="text" placeholder="Placeholder" class="ds-input" />
  <div class="ds-validation-message" data-field="validation">
    This is a validation message.
  </div>
</ds-field>
```

### Counter
You can add a counter to inputs and textareas by adding the `data-field="counter"` attribute to a `<p>` element inside a `ds-field`.

```html
<ds-field class="ds-field">
  <label>Label</label>
  <textarea class="ds-input"></textarea>
  <p data-field="counter" data-limit="20" data-over="%d tegn for mye" data-under="%d tegn igjen"></p>
</ds-field>
```

| attribute  | type   | default               | required |
|------------|--------|-----------------------|----------|
| data-limit | number | undefined             | true     |
| data-over  | string | %d tegn for mye       | false    |
| data-under | string | %d tegn igjen         | false    |

## `<ds-pagination>`
Implements pagination, fills buttons with text.
You can use both `<a>` and `<button>` elements inside the pagination.

If you don't pass any attributes you can implement your own logic for current page and total pages.

```html
<ds-pagination class="ds-pagination" aria-label="Bla i sider:" data-href="?page=%d" data-current="2" data-total="100">
  <ol>
    <li><a>1</a></li>
    <li><a>2</a></li>
    <li><a>3</a></li>
    <li><a>4</a></li>
  </ol>
</ds-pagination>
```

## `<ds-suggestion>`
Extends `u-combobox` from u-elements. See documentation for [u-combobox](https://u-elements.github.io/u-elements/elements/u-combobox).

```html
<ds-field class="ds-field">
  <label>Label</label>
  <ds-suggestion class="ds-suggestion">
    <input type="search" class="ds-input" />
    <del aria-label="Fjern innhold"></del>
    <u-datalist>
      <u-option value="option-1">Option 1</u-option>
      <u-option value="option-2">Option 2</u-option>
      <u-option value="option-3">Option 3</u-option>
    </u-datalist>
  </ds-suggestion>
</ds-field>
```


## `<ds-tabs>`
Extends `u-tabs` from u-elements. See documentation for [u-tabs](https://u-elements.github.io/u-elements/elements/u-tabs).

```html
<ds-tabs class="ds-tabs">
  <ds-tablist>
    <ds-tab>Tab 1</ds-tab>
    <ds-tab>Tab 2</ds-tab>
    <ds-tab>Tab 3</ds-tab>
  </ds-tablist>
  <ds-tabpanel>Panel 1</ds-tabpanel>
  <ds-tabpanel>Panel 2</ds-tabpanel>
  <ds-tabpanel>Panel 3</ds-tabpanel>
</ds-tabs>
```

## `data-toggle-group`
This is implemented differently from `ToggleGroup` in the react package.

An observer will look for `[data-toggle-group]` and add proper arrow navigation plus Enter-key support.

```html
<fieldset class="ds-toggle-group" data-toggle-group="Text alignment" data-variant="secondary">
  <label>
    <input type="radio" name="alignment-two" value="left" checked />
    Left aligned
  </label>
  <label>
    <input type="radio" name="alignment-two" value="center" />
    Center aligned
  </label>
  <label>
    <input type="radio" name="alignment-two" value="right" />
    Right aligned
  </label>
</fieldset>
```

## `data-tooltip`
Using a single element for rendering next to elements with `data-tooltip` attribute.
Also automatically sets `aria-label` or `aria-description` as needed.

```html
<button data-placement="left" data-tooltip="left" class="ds-button">left</button>
```
## `data-clickdelegatefor`
Used for delegating click event. For example, you can use this to delegate click events from a parent element to child elements that are added dynamically.

```html
<div class="ds-card" data-clickdelegatefor="target">
  <a id="target" href="https://example.com" rel="noopener">Go to example</a>
  <span>Clicking this card will open example in a new tab</span>
</div>
```

## `readonly`
Used for fixing `readonly` support on `select` and `input` elements. Add `aria-readonly="true"` to make the element behave as readonly, which means that it will not be editable by the user or call any change events.

```html
<select aria-readonly="true">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
```


## Polyfills

### invokers-polyfill
We automatically attach [invokers-polyfill](https://www.npmjs.com/package/invokers-polyfill/v/0.5.2), which means that you get support for `command` and `commandfor`.

### `<dialog>`
Use the native `<dialog>` element. We polyfill support for [`closedby="any"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy#any). 

```html
<dialog class="ds-dialog" closedby="any" id="my-dialog">
my dialog
</dialog>
```

#### open & close

Use invokers  `command` and `commandfor`, to open and close dialog.
```html
<button class="ds-button" type="button" command="show-modal" commandfor="my-dialog">
  Open dialog
</button>
<dialog id="my-dialog" class="ds-dialog">
  <button class="ds-button" command="close" commandfor="my-dialog">Close</button>
</dialog>
```

### `details` and `summary`
Use native elements. We polyfill a bug in Firefox when combined with Android Talkback screen reader to announce state and role properly.

```html
<details class="ds-details">
  <summary>More info</summary>
  <div>Lorem ipsum dolor sit amet.</div>
</details>
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


