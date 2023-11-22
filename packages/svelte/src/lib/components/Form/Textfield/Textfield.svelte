<script>
  import CharacterCounter from '../CharacterCounter.svelte';
  import { v4 as uuidv4 } from 'uuid';

  /**
   * Label for the textfield.
   */
  export let label = '';

  /**
   * Description for the textfield.
   */
  export let description = '';

  /**
   * Changes field size and paddings. Options are 'xsmall', 'small', 'medium', 'large'.
   * @type {'xsmall' | 'small' | 'medium' | 'large'}
   */
  export let size = 'medium';

  /**
   * Supported `input` types.
   * @type {'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url'}
   */
  export let type = 'text';

  /**
   * Visually hides `label` and `description` (still available for screen readers).
   */
  export let hideLabel = false;

  /**
   * Makes the field read-only.
   */
  export let readOnly = false;

  /**
   * Disables the field.
   */
  export let disabled = false;

  /**
   * Value of the input field.
   */
  export let value;

  /**
   * Error message to display.
   */
  export let error = '';

  /**
   * Prefix for field.
   */
  export let prefix = '';

  /**
   * Suffix for field.
   */
  export let suffix = '';

  /**
   * Sets limit for number of characters.
   */
  export let characterLimit = null;

  /**
   * Sets custom label for shown character limit (function is possible to pass in, see example).
   */
  export let characterLimitLabel = null;

  let componentId = uuidv4();

  let fontSizeClass;

  switch (size) {
    case 'xsmall':
      fontSizeClass = 'font-xsmall';
      break;
    case 'small':
      fontSizeClass = 'font-small';
      break;
    case 'medium':
      fontSizeClass = 'font-medium';
      break;
    case 'large':
      fontSizeClass = 'font-large';
      break;
    default:
      fontSizeClass = 'font-medium';
      break;
  }

  // Computed class names for the component elements
  let formFieldClasses = `form-field ${size} ${disabled ? 'disabled' : ''} ${
    readOnly ? 'readonly' : ''
  } ${$$props.class || ''} ${fontSizeClass}`;
  let labelClasses = `label ${hideLabel ? 'visually-hidden' : ''}`;
  let descriptionClasses = `description ${
    hideLabel ? 'visually-hidden' : ''
  } ${fontSizeClass}`;
  $: fieldClasses = `field ${error ? 'error' : ''}`;
  let inputClasses = `input ${size} ${prefix ? 'input-prefix' : ''} ${
    suffix ? 'input-suffix' : ''
  }`;
  let errorMessageClasses = `error-message ${fontSizeClass}`;
</script>

<div class={formFieldClasses}>
  {#if label}
    <label
      for="input-field"
      class={labelClasses}
    >
      {#if readOnly}
        <!-- Replace the following span with padlock icon component -->
        <span
          aria-hidden
          class="padlock-icon">🔒</span
        >
      {/if}
      <span>{label}</span>
    </label>
  {/if}
  {#if description}
    <p
      id="description"
      class={descriptionClasses}
    >
      {description}
    </p>
  {/if}
  <div class={fieldClasses}>
    {#if prefix}
      <div
        class="adornment prefix"
        aria-hidden="true"
      >
        {prefix}
      </div>
    {/if}
    <input
      bind:value
      on:input
      class={inputClasses}
      id="input-field"
      type="text"
      aria-describedby="description"
      readonly={readOnly}
      {disabled}
      {...$$restProps}
    />
    {#if suffix}
      <div
        class="adornment suffix"
        aria-hidden="true"
      >
        {suffix}
      </div>
    {/if}
  </div>
  {#if characterLimit}
    <CharacterCounter
      maxCount={characterLimit}
      {value}
      id={`character-counter-${componentId}`}
      {size}
      label={characterLimitLabel}
    />
  {/if}
  {#if error}
    <div
      class={errorMessageClasses}
      aria-live="polite"
    >
      {error}
    </div>
  {/if}
</div>

<style>
  .formField {
    display: grid;
    gap: var(--fds-spacing-2);
  }

  .adornment {
    color: var(--fds-semantic-border-neutral-default);
    background: var(--fds-semantic-surface-neutral-subtle);
    padding: var(--fds-spacing-3);
    border-radius: var(--fds-border_radius-medium);
    border: solid 1px var(--fds-semantic-border-neutral-default);
    box-sizing: border-box;
    display: inline-block;
  }

  .label {
    min-width: min-content;
    display: inline-flex;
    flex-direction: row;
    gap: var(--fds-spacing-1);
    align-items: center;
  }

  .description {
    color: var(--fds-semantic-text-neutral-subtle);
    margin-top: calc(var(--fds-spacing-2) * -1);
  }

  .input {
    font: inherit;
    position: relative;
    box-sizing: border-box;
    flex: 0 1 auto;
    min-height: 2.5em;
    width: 100%;
    appearance: none;
    padding: 0 var(--fds-spacing-3);
    border: solid 1px var(--fds-semantic-border-action-dark);
    border-radius: var(--fds-border_radius-medium);
  }

  .input.xsmall,
  .input.small {
    padding: 0 var(--fds-spacing-2);
  }

  .input.medium {
    padding: 0 var(--fds-spacing-3);
  }

  .input.large {
    padding: 0 var(--fds-spacing-4);
  }

  .disabled {
    opacity: 0.3;
  }

  .disabled .input {
    cursor: not-allowed;
  }

  .readonly .input {
    background: var(--fds-semantic-surface-neutral-subtle);
    border-color: var(--fds-semantic-border-neutral-default);
  }

  .error > .input:not(:focus-visible) {
    border-color: var(--fds-semantic-text-danger-default, #b3253a);
    box-shadow: inset 0 0 0 1px var(--fds-semantic-text-danger-default, #b3253a);
  }

  @media (hover: hover) and (pointer: fine) {
    .input:not(:focus-visible, :disabled):hover {
      border-color: var(--fds-semantic-border-action-hover);
      box-shadow: inset 0 0 0 1px var(--fds-semantic-border-action-hover);
    }
  }

  .inputPrefix {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .inputSuffix {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .prefix {
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .suffix {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .field {
    display: flex;
    align-items: stretch;
    border-radius: var(--fds-border_radius-medium);
  }

  .field > *:first-child {
    border-top-left-radius: var(--fds-border_radius-medium);
    border-bottom-left-radius: var(--fds-border_radius-medium);
  }

  .field > *:last-child {
    border-top-right-radius: var(--fds-border_radius-medium);
    border-bottom-right-radius: var(--fds-border_radius-medium);
  }

  .padlock {
    height: 1.2rem;
    width: 1.2rem;
  }

  .errorMessage:empty {
    display: none;
  }

  .error-message {
    color: var(--fds-semantic-text-danger-default, #b3253a);
  }

  .font-xsmall {
    font-size: 0.8125rem;
  }
  .font-small {
    font-size: 0.9375rem;
  }
  .font-medium {
    font-size: 1.125rem;
  }
  .font-large {
    font-size: 1.25rem;
  }
</style>
