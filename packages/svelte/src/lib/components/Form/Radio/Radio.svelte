<script>
  import { getContext } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';

  /**
   * Radio
   *
   * @prop {string} [description=''] - Description for radio.
   * @prop {boolean} [disabled=undefined] - Toggle disabled for radio.
   * @prop {boolean} [readOnly=undefined] - Toggle readOnly for radio.
   * @prop {string} [label] - Label for radio.
   * @prop {string} [value] - Value for radio.
   */

  export let description = '';
  export let disabled = undefined;
  export let readOnly = undefined;
  export let label;
  export let value;

  let size;
  let selectedValue;
  let groupUniqueId;
  let error;

  let groupDisabled = false;
  let groupReadOnly = false;

  const uniqueId = uuidv4();
  const radioId = `radio-${uniqueId}`;
  const labelId = `label-${uniqueId}`;
  const descriptionId = `description-${uniqueId}`;

  $: checked = value === selectedValue;

  const radioGroup = getContext('radioGroup');

  $: if ($radioGroup) {
    size = $radioGroup.size;
    groupDisabled = $radioGroup.disabled;
    groupReadOnly = $radioGroup.readOnly;
    groupUniqueId = $radioGroup.uniqueId;
    selectedValue = $radioGroup.value;
    error = $radioGroup.error;
  }

  const sizes = {
    xsmall: {
      iconSizeClass: 'icon-xsmall',
      fontSizeClass: 'font-xsmall',
      spacingClass: 'spacing-xsmall',
      controlClass: 'control-xsmall',
      paddingClass: 'padding-xsmall',
    },
    small: {
      iconSizeClass: 'icon-small',
      fontSizeClass: 'font-small',
      spacingClass: 'spacing-small',
      controlClass: 'control-small',
      paddingClass: 'padding-small',
    },
    medium: {
      iconSizeClass: 'icon-medium',
      fontSizeClass: 'font-medium',
      spacingClass: 'spacing-medium',
      controlClass: 'control-medium',
      paddingClass: 'padding-medium',
    },
    large: {
      iconSizeClass: 'icon-large',
      fontSizeClass: 'font-large',
      spacingClass: 'spacing-large',
      controlClass: 'control-large',
      paddingClass: 'padding-large',
    },
  };

  /**
   * @param {string | number} size
   */
  function getSizeClasses(size) {
    return sizes[size] || sizes.medium;
  }

  $: sizeClasses = getSizeClasses(size);

  $: containerClasses = `container ${sizeClasses.spacingClass} ${
    disabled || groupDisabled ? 'disabled' : ''
  } ${error ? 'error' : ''} ${readOnly || groupReadOnly ? 'readonly' : ''} ${
    $$props.class || ''
  }`;

  $: labelClasses = `label ${readOnly || groupReadOnly ? 'readonly' : ''} 
                            ${disabled || groupDisabled ? 'disabled' : ''}
                            ${sizeClasses.paddingClass}`;
  $: descriptionClasses = `description ${sizeClasses.fontSizeClass}`;

  $: inputClasses = `input ${readOnly || groupReadOnly ? 'readonly' : ''} 
                            ${disabled || groupDisabled ? 'disabled' : ''}`;
</script>

<div
  class={`${containerClasses} ${sizeClasses.fontSizeClass}`}
  tabindex="-1"
  role="radio"
  aria-checked={checked}
  aria-label={label}
  aria-labelledby={labelId}
  id={radioId}
>
  <span class={`control radio ${sizeClasses.controlClass}`}>
    <input
      class={inputClasses}
      type="radio"
      id={labelId}
      {value}
      bind:group={selectedValue}
      name={`radio-${groupUniqueId}`}
      disabled={disabled || readOnly || groupDisabled || groupReadOnly}
    />
    <svg
      class="icon {sizeClasses.iconSizeClass}"
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
    <span class={sizeClasses.fontSizeClass}>
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
  }

  .control-xsmall {
    margin-left: -0.7rem;
  }
  .control-small {
    margin-left: -0.6rem;
  }
  .control-medium {
    margin-left: -0.45rem;
  }
  .control-large {
    margin-left: -0.2rem;
  }

  .spacing-xsmall {
    padding-left: calc(var(--fds-spacing-6) + 0.15rem);
  }
  .spacing-small {
    padding-left: calc(var(--fds-spacing-6) + 0.3rem);
  }
  .spacing-medium {
    padding-left: calc(var(--fds-spacing-6) + 1.0625rem);
  }
  .spacing-large {
    padding-left: calc(var(--fds-spacing-6) + 1.4rem);
  }

  .icon {
    grid-area: input;
    pointer-events: none;
    height: 1.75rem;
    width: 1.75rem;
    margin: auto;
    overflow: visible;
  }

  .label {
    padding-left: 1.1875rem;
    margin-left: -1rem;
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
    color: var(--fds-semantic-text-neutral-subtle, #4b5563);
  }
  .control {
    --fds-inner-focus-border-color: var(--fds-semantic-border-focus-boxshadow);
    --fds-outer-focus-border-color: var(--fds-semantic-border-focus-outline);
    --fds-focus-border-width: 3px;

    position: absolute;
    left: 0;
    top: 0;
    min-width: 2.75rem;
    min-height: 2.75rem;
    display: inline-grid;
    grid: [input] 1fr / [input] 1fr;
    gap: var(--fds-spacing-2);
    grid-auto-flow: column;
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
    color: var(--semantic-border-neutral-subtle, #cfd1cf);
  }

  .disabled > .description {
    color: var(--semantic-border-neutral-subtle, #cfd1cf);
  }

  .input:not(:checked) ~ .icon .checked {
    display: none;
  }

  .input:checked ~ .icon .checked {
    display: inline;
    fill: var(--fds-semantic-surface-first-active, #21365e);
  }

  .input:not(:checked) ~ .icon .box {
    stroke: var(--fds-semantic-border-first-default, #00244e);
  }

  .input:checked ~ .icon .box {
    stroke: var(--fds-semantic-border-first-default, #00244e);
  }

  .input:disabled ~ .icon .box {
    stroke: var(--fds-semantic-border-neutral-subtle, #cfd1cf);
  }

  .input:focus-visible ~ .icon {
    outline: var(--fds-focus-border-width) solid
      var(--fds-semantic-border-focus-outline, #ffda06);
    outline-offset: 0;
  }

  .input:focus-visible ~ .icon .box {
    stroke: var(--fds-semantic-border-focus-boxshadow, #1e2b3c);
    stroke-width: var(--fds-focus-border-width);
  }

  .input:disabled ~ .icon .checked {
    fill: var(--fds-semantic-border-neutral-default, #68707c);
  }

  .error .input:not(:disabled, :focus-visible) ~ .icon .box {
    stroke: var(--fds-semantic-border-danger-default, #e02e49);
  }

  .error .input:not(:disabled, :focus-visible) ~ .icon .checked {
    fill: var(--fds-semantic-border-danger-default, #e02e49);
  }

  .readonly .input:read-only:not(:focus-visible) ~ .icon .box {
    stroke: var(--fds-semantic-border-neutral-subtle, #cfd1cf);
    fill: var(--fds-semantic-surface-neutral-subtle, #eff0ef);
  }

  .readonly .input:read-only:not(:focus-visible):is(:checked) ~ .icon .checked {
    fill: var(--fds-semantic-border-neutral-default, #68707c);
  }

  /* Only use hover for non-touch devices to prevent sticky-hovering */
  @media (hover: hover) and (pointer: fine) {
    .container:not(.disabled, .readonly) > .control:hover,
    .container:not(.disabled, .readonly):has(.label:hover) > .control {
      background: var(--semantic-surface-action-first-subtle-hover, #c8cbdc);
    }

    .container:not(.disabled, .readonly) > .label:hover,
    .container:not(.disabled, .readonly) > .control:hover ~ .label {
      color: var(--fds-semantic-text-action-first-hover, #3c4a71);
    }

    .container:not(.disabled, .readonly) > .control:hover > .icon > .box,
    .container:not(.disabled, .readonly):has(.label:hover)
      > .control
      > .icon
      > .box {
      stroke: var(--fds-semantic-border-input-hover, #4c76ba);
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

    .icon-xsmall {
      height: 1.375rem;
      width: 1.375rem;
    }
    .icon-small {
      height: 1.6875em;
      width: 1.6875em;
    }
    .icon-medium {
      height: 2rem;
      width: 2rem;
    }
    .icon-large {
      height: 2.3125rem;
      width: 2.3125rem;
    }
  }
</style>
