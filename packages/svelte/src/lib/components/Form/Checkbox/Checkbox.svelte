<script>
  import { getContext } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';

  /**
   * Checkbox
   *
   * @prop {string} [label] - Label for checkbox.
   * @prop {string} [description=''] - Description for checkbox.
   * @prop {boolean} [disabled=undefined] - Toggle disabled for checkbox.
   * @prop {boolean} [readOnly=undefined] - Toggle readOnly for checkbox.
   * @prop {string} [value] - Value for checkbox.
   */

  export let label;
  export let description = '';
  export let disabled = undefined;
  export let readOnly = undefined;
  export let value;
  export let checked = false;

  let size;
  let groupUniqueId;
  let error;
  let groupValue;

  let groupDisabled = false;
  let groupReadOnly = false;
  let isPartOfGroup = false;

  const uniqueId = uuidv4();
  const checkboxId = `checkbox-${uniqueId}`;
  const labelId = `label-${uniqueId}`;
  const descriptionId = `description-${uniqueId}`;
  const checkboxGroup = getContext('checkboxGroup');

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

  if (checkboxGroup) {
    isPartOfGroup = true;
    checkboxGroup.subscribe(($checkboxGroup) => {
      groupValue = $checkboxGroup.value;
      if (groupValue.includes(value)) {
        checked = true;
      }
    });
  } else {
    checked = checked;
  }

  function handleStandaloneChange(event) {
    checked = event.target.checked;
  }

  function handleGroupChange(event) {
    if (event.target.checked) {
      checkboxGroup.update((storeValue) => ({
        ...storeValue,
        value: [...storeValue.value, value],
      }));
    } else {
      checkboxGroup.update((storeValue) => ({
        ...storeValue,
        value: storeValue.value.filter((v) => v !== value),
      }));
    }
  }

  function handleChange(event) {
    if (isPartOfGroup) {
      handleGroupChange(event);
    } else {
      handleStandaloneChange(event);
    }
  }

  /**
   * @param {string | number} size
   */
  function getSizeClasses(size) {
    return sizes[size] || sizes.medium;
  }

  $: if ($checkboxGroup) {
    size = $checkboxGroup.size;
    groupDisabled = $checkboxGroup.disabled;
    groupReadOnly = $checkboxGroup.readOnly;
    groupUniqueId = $checkboxGroup.uniqueId;
    error = $checkboxGroup.error;
  }

  $: sizeClasses = getSizeClasses(size);

  $: containerClasses = `container ${sizeClasses.spacingClass} ${
    disabled || groupDisabled ? 'disabled' : ''
  } ${error ? 'error' : ''} ${readOnly || groupReadOnly ? 'readonly' : ''} ${
    $$props.class || ''
  }`;

  $: inputClasses = `input ${readOnly || groupReadOnly ? 'readonly' : ''} 
                            ${disabled || groupDisabled ? 'disabled' : ''}`;
  $: labelClasses = `label ${readOnly || groupReadOnly ? 'readonly' : ''} 
                            ${disabled || groupDisabled ? 'disabled' : ''}
                            ${sizeClasses.paddingClass}`;
  $: descriptionClasses = `description ${sizeClasses.fontSizeClass}`;
</script>

<div
  class={`${containerClasses} ${sizeClasses.fontSizeClass}`}
  tabindex="-1"
  role="checkbox"
  aria-checked={checked}
  aria-label={label}
  aria-labelledby={labelId}
  id={checkboxId}
>
  <span class={`control checkbox ${sizeClasses.controlClass}`}>
    <input
      class={inputClasses}
      type="checkbox"
      id={labelId}
      {value}
      bind:checked
      on:change={handleChange}
      name={`checkbox-${groupUniqueId}`}
      disabled={disabled || readOnly || groupDisabled || groupReadOnly}
    />
    <svg
      class="icon {sizeClasses.iconSizeClass}"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="box"
        x="1"
        y="1"
        width="20"
        height="20"
        rx="0.125rem"
        ry="0.125rem"
        fill="white"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        class="checked"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.7876 6.27838C18.1171 6.60788 18.1171 7.14212 17.7876 7.47162L9.99591 15.2633C9.6664 15.5928 9.13217 15.5928 8.80267 15.2633L4.67767 11.1383C4.34816 10.8088 4.34816 10.2745 4.67767 9.94505C5.00717 9.61554 5.5414 9.61554 5.87091 9.94505L9.39929 13.4734L16.5943 6.27838C16.9238 5.94887 17.4581 5.94887 17.7876 6.27838Z"
        fill="white"
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

  .spacing-xsmall {
    padding-left: var(--fds-spacing-6);
  }
  .spacing-small {
    padding-left: var(--fds-spacing-7);
  }
  .spacing-medium {
    padding-left: calc(var(--fds-spacing-8) + var(--fds-spacing-1));
  }
  .spacing-large {
    padding-left: calc(var(--fds-spacing-8) + var(--fds-spacing-3));
  }

  .icon {
    grid-area: input;
    pointer-events: none;
    height: 1.75rem;
    width: 1.75rem;
    margin: auto;
    overflow: visible;
  }

  .checkbox,
  .checkbox .icon {
    border-radius: var(--fds-border_radius-interactive);
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
  }

  .input:not(:checked) ~ .icon .box {
    stroke: var(--fds-semantic-border-input-default);
  }

  .input:disabled ~ .icon .box {
    stroke: var(--fds-semantic-border-neutral-subtle);
    fill: white;
  }

  .input:checked:not(:disabled) ~ .icon .box {
    stroke: var(--fds-semantic-border-input-hover);
    fill: var(--fds-semantic-border-input-hover);
  }

  .input:focus-visible ~ .icon {
    outline: var(--fds-focus-border-width) solid
      var(--fds-outer-focus-border-color);
    outline-offset: 0;
  }

  .input:focus-visible:not(:disabled) ~ .icon .box {
    stroke: var(--fds-semantic-border-focus-boxshadow);
    stroke-width: var(--fds-focus-border-width);
  }

  .input:disabled ~ .icon .checked {
    fill: var(--fds-semantic-border-neutral-subtle);
  }

  .error .input:not(:disabled, :focus-visible, :checked) ~ .icon .box {
    stroke: var(--fds-semantic-text-danger-default, #b3253a);
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

    .control-xsmall {
      margin-left: -0.8rem;
    }
    .control-small {
      margin-left: -0.75rem;
    }
    .control-medium {
      margin-left: -0.55rem;
    }
    .control-large {
      margin-left: -0.45rem;
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
      height: 1.2rem;
      width: 1.2rem;
    }
    .icon-small {
      height: 1.375em;
      width: 1.375em;
    }
    .icon-medium {
      height: 1.6875rem;
      width: 1.6875rem;
    }
    .icon-large {
      height: 2rem;
      width: 2rem;
    }
  }
</style>
