<script>
  import { getContext } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';

  /**
   * Radio
   *
   * @prop {string} [description=''] - Description for field.
   * @prop {boolean} [disabled=false] - Disables element.
   * @prop {boolean} [readOnly=false] - Toggle readOnly.
   * @prop {string} [label] - Label of the input element.
   * @prop {string} [value] - Value of the input element.
   */

  export let description = '';
  export let disabled = undefined;
  export let readOnly = undefined;
  export let label;
  export let value;

  let size = 'medium';
  let selectedValue;
  let groupUniqueId;
  let error;

  const uniqueId = uuidv4();
  const radioId = `radio-${uniqueId}`;
  const labelId = `label-${uniqueId}`;
  const descriptionId = `description-${uniqueId}`;

  $: checked = value === selectedValue;

  const radioGroup = getContext('radioGroup');

  if (radioGroup && radioGroup.size) {
    size = radioGroup.size;
  }

  if (radioGroup && radioGroup.disabled && disabled === undefined) {
    disabled = radioGroup.disabled;
  }

  if (radioGroup && radioGroup.readOnly && readOnly === undefined) {
    readOnly = radioGroup.readOnly;
  }

  if (radioGroup && radioGroup.uniqueId) {
    groupUniqueId = radioGroup.uniqueId;
  }

  if (radioGroup && radioGroup.value) {
    selectedValue = radioGroup.value;
  }

  if (radioGroup && radioGroup.error) {
    error = radioGroup.error;
  }

  let iconSizeClass;
  let fontSizeClass;
  let spacingClass;
  switch (size) {
    case 'xsmall':
      iconSizeClass = 'icon-xsmall';
      fontSizeClass = 'font-xsmall';
      spacingClass = 'spacing-xsmall';
      break;
    case 'small':
      iconSizeClass = 'icon-small';
      fontSizeClass = 'font-small';
      spacingClass = 'spacing-small';
      break;
    case 'medium':
      iconSizeClass = 'icon-medium';
      fontSizeClass = 'font-medium';
      spacingClass = 'spacing-medium';
      break;
    default:
      iconSizeClass = 'icon-medium';
      fontSizeClass = 'font-medium';
      spacingClass = 'spacing-medium';
      break;
  }
  let containerClasses = `container ${spacingClass} ${
    disabled ? 'disabled' : ''
  } ${error ? 'error' : ''} ${readOnly ? 'readonly' : ''} ${
    $$props.class || ''
  }`;

  let labelClasses = `label ${readOnly ? 'readonly' : ''} 
                            ${disabled ? 'disabled' : ''}`;
  let descriptionClasses = `description ${fontSizeClass}`;

  let inputClasses = `input ${readOnly ? 'readonly' : ''} 
                            ${disabled ? 'disabled' : ''}`;
</script>

<div
  class={`${containerClasses} ${fontSizeClass}`}
  tabindex="-1"
  role="radio"
  aria-checked={checked}
  aria-label={label}
  aria-labelledby={labelId}
  id={radioId}
>
  <span class={`control radio`}>
    <input
      class={inputClasses}
      type="radio"
      id={labelId}
      {value}
      bind:group={selectedValue}
      name={`radio-${groupUniqueId}`}
      disabled={disabled || readOnly}
    />
    <svg
      class="icon {iconSizeClass}"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        class="box"
        name="circle"
        cx="11"
        cy="11"
        r="10"
        fill="white"
        stroke="#00315D"
        stroke-width="2"
      />
      <circle
        class="checked"
        name="checked"
        cx="11"
        cy="11"
        r="4.88889"
        fill="#0062BA"
      />
    </svg>
  </span>
  <label
    for={labelId}
    class={labelClasses}
  >
    <span class={fontSizeClass}>
      {label}
    </span>
  </label>
  {#if description}
    <p
      id={descriptionId}
      class={descriptionClasses}
    >
      {description}
    </p>
  {/if}
</div>

<style lang="scss">
  .container {
    position: relative;
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding-left: 0;
    margin-left: 0;
  }

  .spacing-xsmall {
    padding-left: calc(var(--fds-spacing-6));
  }
  .spacing-small {
    padding-left: calc(var(--fds-spacing-6) + 0.6rem);
  }
  .spacing-medium {
    padding-left: calc(var(--fds-spacing-6) + 1.0625rem);
  }

  .icon {
    grid-area: input;
    pointer-events: none;
    height: 1.75rem;
    width: 1.75rem;
    margin: auto;
    margin-left: 0;
    overflow: visible;
  }

  .label {
    padding-left: 0.1875rem;
    min-height: 2.75rem;
    min-width: min-content;
    display: inline-flex;
    flex-direction: row;
    gap: var(--fds-spacing-1);
    align-items: center;
    cursor: pointer;
  }

  .description {
    padding-left: 0.1875rem;
    margin-top: calc(var(--fds-spacing-2) * -1);
    margin-bottom: 0.25rem;
    color: var(--fds-semantic-text-neutral-subtle);
  }

  .control {
    --fds-inner-focus-border-color: var(--fds-semantic-border-focus-boxshadow);
    --fds-outer-focus-border-color: var(--fds-semantic-border-focus-outline);
    --fds-focus-border-width: 0.1875rem;

    position: absolute;
    left: 0;
    top: 0;
    min-width: 2.75rem;
    min-height: 2.75rem;
    display: inline-grid;
    grid: [input] 1fr / [input] 1fr;
    gap: var(--fds-spacing-2);
    grid-auto-flow: column;
    left: 0;
    justify-items: left;
  }

  .radio,
  .radio .icon {
    border-radius: var(--fds-border_radius-full);
  }

  .input {
    height: 100%;
    width: 100%;
    opacity: 0;
    margin: 0;
    grid-area: input;
    cursor: pointer;
  }

  .readonly > .control > .input,
  .readonly > .label {
    cursor: default;
  }

  .disabled > .control .input,
  .disabled > .label {
    cursor: not-allowed;
    color: var(--fds-semantic-border-neutral-subtle);
  }

  .disabled > .description {
    color: var(--fds-semantic-border-neutral-subtle);
  }

  .input:not(:checked) ~ .icon .checked {
    display: none;
  }

  .input:checked ~ .icon .checked {
    display: inline;
    fill: var(--fds-semantic-border-input-hover);
  }

  .input:not(:checked) ~ .icon .box {
    stroke: var(--fds-semantic-border-input-default);
  }

  .input:checked ~ .icon .box {
    stroke: var(--fds-semantic-border-input-hover);
  }

  .input:disabled ~ .icon .box {
    stroke: var(--fds-semantic-border-neutral-subtle);
  }

  .input:focus-visible ~ .icon {
    outline: var(--fds-focus-border-width) solid
      var(--fds-outer-focus-border-color);
    outline-offset: 0;
  }

  .input:focus-visible ~ .icon .box {
    stroke: var(--fds-semantic-border-focus-boxshadow);
    stroke-width: var(--fds-focus-border-width);
  }

  .input:disabled ~ .icon .checked {
    fill: var(--fds-semantic-border-neutral-subtle);
  }

  .error .input:not(:disabled, :focus-visible) ~ .icon .box {
    stroke: var(--fds-semantic-border-danger-default);
  }

  .error .input:not(:disabled, :focus-visible) ~ .icon .checked {
    fill: var(--fds-semantic-border-danger-default);
  }

  .readonly .input:read-only:not(:focus-visible) ~ .icon .box {
    stroke: var(--fds-semantic-border-neutral-subtle);
    fill: var(--fds-semantic-background-subtle);
  }

  .readonly .input:read-only:not(:focus-visible):is(:checked) ~ .icon .checked {
    fill: var(--fds-semantic-border-neutral-default);
  }

  /* Only use hover for non-touch devices to prevent sticky-hovering */
  @media (hover: hover) and (pointer: fine) {
    .container:not(.disabled, .readonly) > .control:hover,
    .container:not(.disabled, .readonly):has(.label:hover) > .control {
      background: var(--fds-semantic-surface-info-subtle-hover);
    }

    .container:not(.disabled, .readonly) > .label:hover,
    .container:not(.disabled, .readonly) > .control:hover ~ .label {
      color: var(--fds-semantic-border-input-hover);
    }

    .container:not(.disabled, .readonly) > .control:hover > .icon > .box,
    .container:not(.disabled, .readonly):has(.label:hover)
      > .control
      > .icon
      > .box {
      stroke: var(--fds-semantic-border-input-hover);
    }

    .icon-xsmall {
      height: 1.375rem;
      width: 1.375em;
    }
    .icon-small {
      height: 1.6875rem;
      width: 1.6875rem;
    }
    .icon-medium {
      height: 2rem;
      width: 2rem;
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
  }
</style>
