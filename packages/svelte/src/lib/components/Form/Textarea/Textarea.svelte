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
  $: fieldClasses = `${error ? 'error' : ''}`;
  let textareaClasses = `textarea ${size}`;
  let errorMessageClasses = `error-message ${fontSizeClass}`;
</script>

<div class={formFieldClasses}>
  {#if label}
    <label
      for={`textarea-${componentId}`}
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
    <textarea
      bind:value
      on:input
      class={textareaClasses}
      id={`textarea-${componentId}`}
      aria-describedby="description"
      readonly={readOnly}
      {disabled}
      {...$$restProps}
    />
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

  .padlock {
    height: 1.2rem;
    width: 1.2rem;
  }

  .errorMessage:empty {
    display: none;
  }

  .label {
    min-width: min-content;
    display: inline-flex;
    flex-direction: row;
    gap: var(--fds-spacing-1);
    align-items: center;
    margin-bottom: var(--fds-spacing-3);
  }

  .description {
    color: var(--fds-semantic-text-neutral-subtle);
    margin-top: calc(var(--fds-spacing-2) * -1);
    margin-bottom: var(--fds-spacing-2);
  }

  .textarea {
    font: inherit;
    position: relative;
    box-sizing: border-box;
    flex: 0 1 auto;
    min-height: 2.5em;
    width: 100%;
    appearance: none;
    padding: var(--fds-spacing-3);
    border: solid 1px var(--fds-semantic-border-action-dark);
    border-radius: var(--fds-border_radius-medium);
    resize: vertical;
  }

  .textarea.xsmall,
  .textarea.small {
    padding: var(--fds-spacing-2);
  }

  .textarea.medium {
    padding: var(--fds-spacing-3);
  }

  .textarea.large {
    padding: var(--fds-spacing-4);
  }

  .disabled {
    opacity: 0.3;
  }

  .disabled .textarea {
    cursor: not-allowed;
  }

  .readonly .textarea {
    background: var(--fds-semantic-surface-neutral-subtle);
    border-color: var(--fds-semantic-border-neutral-default);
  }

  .error > .textarea:not(:focus-visible) {
    border-color: var(--fds-semantic-text-danger-default, #b3253a);
    box-shadow: inset 0 0 0 1px var(--fds-semantic-text-danger-default, #b3253a);
  }

  @media (hover: hover) and (pointer: fine) {
    .textarea:not(:focus-visible, :disabled):hover {
      border-color: var(--fds-semantic-border-action-hover);
      box-shadow: inset 0 0 0 1px var(--fds-semantic-border-action-hover);
    }
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
  .visually-hidden {
    display: none;
    visibility: hidden;
  }
</style>
