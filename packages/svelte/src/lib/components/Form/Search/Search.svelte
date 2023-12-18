<script>
  import CharacterCounter from '../CharacterCounter.svelte';
  import { v4 as uuidv4 } from 'uuid';

  /**
   * Label for the search component.
   */
  export let label = '';

  /**
   * Description for the search component.
   */
  export let description = '';

  /**
   * Changes field size and paddings. Options are 'xsmall', 'small', 'medium', 'large'.
   * @type {'xsmall' | 'small' | 'medium' | 'large'}
   */
  export let size = 'medium';

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
      for="search-field"
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
      placeholder="Søk"
      name="search"
      id="search-field"
      type="search"
      aria-describedby="search field"
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
    width: 100%;
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
    background-color: white;
    background-repeat: no-repeat;
    border: solid 1px var(--fds-semantic-border-action-dark);
    border-radius: var(--fds-border_radius-medium);
  }

  .input.xsmall,
  .input.small {
    padding-left: 36px;
    padding-right: 4px;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 27" fill="none"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M5.75 11.8125C5.75 8.18813 8.68813 5.25 12.3125 5.25C15.9369 5.25 18.875 8.18813 18.875 11.8125C18.875 15.4369 15.9369 18.375 12.3125 18.375C8.68813 18.375 5.75 15.4369 5.75 11.8125ZM12.3125 3.75C7.8597 3.75 4.25 7.3597 4.25 11.8125C4.25 16.2653 7.8597 19.875 12.3125 19.875C14.2688 19.875 16.0624 19.1782 17.4586 18.0193L23.6064 24.167C23.8993 24.4599 24.3741 24.4599 24.667 24.167C24.9599 23.8741 24.9599 23.3993 24.667 23.1064L18.5193 16.9586C19.6782 15.5624 20.375 13.7688 20.375 11.8125C20.375 7.3597 16.7653 3.75 12.3125 3.75Z" fill="%231E2B3C"/%3E%3C/svg%3E');
    background-position: 8px center;
  }

  .input.medium {
    padding-left: 40px;
    padding-right: 4px;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M5.75 11.8125C5.75 8.18813 8.68813 5.25 12.3125 5.25C15.9369 5.25 18.875 8.18813 18.875 11.8125C18.875 15.4369 15.9369 18.375 12.3125 18.375C8.68813 18.375 5.75 15.4369 5.75 11.8125ZM12.3125 3.75C7.8597 3.75 4.25 7.3597 4.25 11.8125C4.25 16.2653 7.8597 19.875 12.3125 19.875C14.2688 19.875 16.0624 19.1782 17.4586 18.0193L23.6064 24.167C23.8993 24.4599 24.3741 24.4599 24.667 24.167C24.9599 23.8741 24.9599 23.3993 24.667 23.1064L18.5193 16.9586C19.6782 15.5624 20.375 13.7688 20.375 11.8125C20.375 7.3597 16.7653 3.75 12.3125 3.75Z" fill="%231E2B3C"/%3E%3C/svg%3E');
    background-position: 8px center;
  }

  .input.large {
    padding-left: 44px;
    padding-right: 4px;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 28 27" fill="none"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M5.75 11.8125C5.75 8.18813 8.68813 5.25 12.3125 5.25C15.9369 5.25 18.875 8.18813 18.875 11.8125C18.875 15.4369 15.9369 18.375 12.3125 18.375C8.68813 18.375 5.75 15.4369 5.75 11.8125ZM12.3125 3.75C7.8597 3.75 4.25 7.3597 4.25 11.8125C4.25 16.2653 7.8597 19.875 12.3125 19.875C14.2688 19.875 16.0624 19.1782 17.4586 18.0193L23.6064 24.167C23.8993 24.4599 24.3741 24.4599 24.667 24.167C24.9599 23.8741 24.9599 23.3993 24.667 23.1064L18.5193 16.9586C19.6782 15.5624 20.375 13.7688 20.375 11.8125C20.375 7.3597 16.7653 3.75 12.3125 3.75Z" fill="%231E2B3C"/%3E%3C/svg%3E');
    background-position: 10px center;
  }

  .input::placeholder {
    color: var(--semantic-text-neutral-default, #1e2b3c);
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
