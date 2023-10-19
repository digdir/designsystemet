<script>
  import { createEventDispatcher, onMount } from 'svelte';
  /**
   * `Switch` component for toggling between two states.
   * @prop {string} [value=''] - Value of the `input` element.
   * @prop {string} [position='left'] - Position of switch around the label. Options are 'left', 'right'.
   * @prop {boolean} [disabled=false] - If `Switch` is disabled.
   * @prop {boolean} [readOnly=false] - If `Switch` is read-only.
   * @prop {string} [description=''] - Description text for the `Switch`.
   * @prop {string} [size='medium'] - Size of the paragraph. Options are 'small', 'medium', 'large'.
   * @prop {string} [id=''] - ID for the `input` element.
   * @prop {boolean} [checked=false] - If `Switch` is checked.
   */
  export let value = '';
  export let position = 'left';
  export let disabled = false;
  export let readOnly = false;
  export let description = '';
  export let size = 'medium';
  export let id = '';
  export let checked = false;

  const dispatch = createEventDispatcher();

  function handleInputClick(event) {
    if (readOnly) {
      event.preventDefault();
      return;
    }
    dispatch('click', event);
  }

  function handleInputChange(event) {
    if (readOnly) {
      event.preventDefault();
      return;
    }
    dispatch('change', { checked: event.target.checked });
  }

  $: computedClass = `wrapper paragraph ${size} ${
    position === 'right' ? 'right' : ''
  } ${disabled ? 'disabled' : ''} ${readOnly ? 'readonly' : ''} ${
    $$props.class || ''
  }`;
  $: labelClass = `label ${size}`;
  $: descriptionClass = `paragraph description ${size}`;
</script>

<div class={computedClass}>
  <input
    class="input"
    {id}
    {value}
    type="checkbox"
    readonly={readOnly}
    {disabled}
    bind:checked
    on:click={handleInputClick}
    on:change={handleInputChange}
  />
  <svg
    class="icon"
    width="54"
    height="32"
    viewBox="0 0 56 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      class="track"
      x="1"
      y="1"
      width="54"
      height="32"
      rx="16"
      stroke="currentcolor"
      fill="currentcolor"
    />
    <g class="thumb">
      <circle
        cx="17"
        cy="17"
        r="14"
        fill="currentcolor"
      />
      <path
        class="checkmark"
        d="M18.1958 5.63756C18.8792 6.32098 18.8792 7.42902 18.1958 8.11244L10.4041 15.9041C9.72068 16.5875 8.61264 16.5875 7.92922 15.9041L3.80422 11.7791C3.1208 11.0957 3.1208 9.98765 3.80422 9.30423C4.48764 8.62081 5.59568 8.62081 6.27909 9.30423L9.16666 12.1918L15.7209 5.63756C16.4043 4.95415 17.5123 4.95415 18.1958 5.63756Z"
        fill="currentcolor"
      />
    </g>
  </svg>

  {#if $$slots.default}
    <label
      class={labelClass}
      for={id}
    >
      {#if readOnly}
        <!-- PadlockLockedFillIcon from aksel-navikt should come here -->
        <span
          aria-hidden
          class="padlock">🔒</span
        >
      {/if}
      <slot />
    </label>
  {/if}
  {#if description}
    <div
      id="description-{id}"
      class={descriptionClass}
    >
      {description}
    </div>
  {/if}
</div>

<style>
  .wrapper {
    display: grid;
    align-items: center;
    width: fit-content;
    min-height: 44px;
    gap: 0 var(--fds-spacing-2);
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'input label'
      '. description';
  }
  .switch {
    --fds-inner-focus-border-color: var(--fds-semantic-border-focus-boxshadow);
    --fds-outer-focus-border-color: var(--fds-semantic-border-focus-outline);
    --fds-focus-border-width: 3px;
    --fds-transition: 200ms;
    min-width: 44px;
    min-height: 44px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
  }

  .input {
    min-width: 54px;
    min-height: 32px;
    width: 100%;
    opacity: 0;
    grid-area: input;
    cursor: pointer;
  }

  @media (prefers-reduced-motion) {
    .container {
      --fds-transition: 0;
    }
  }

  .paragraph {
    --fdsc-typography-font-family: inherit;
    --fdsc-bottom-spacing: var(--fds-spacing-5);

    color: var(--fds-semantic-text-neutral-default);
    margin: 0;
  }
  .paragraph.large {
    --fdsc-bottom-spacing: var(--fds-spacing-6);

    font: var(--fds-typography-paragraph-large);
    font-family: var(--fdsc-typography-font-family);
  }
  .paragraph.medium {
    --fdsc-bottom-spacing: var(--fds-spacing-5);

    font: var(--fds-typography-paragraph-medium);
    font-family: var(--fdsc-typography-font-family);
  }
  .paragraph.small {
    --fdsc-bottom-spacing: var(--fds-spacing-4);

    font: var(--fds-typography-paragraph-small);
    font-family: var(--fdsc-typography-font-family);
  }

  .right {
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'label input'
      'description .';
  }

  .icon {
    grid-area: input;
    pointer-events: none;
    height: 1.75em;
    width: auto;
    margin: auto;
    overflow: visible;
    border-radius: 16px;
    --fds-transition: 200ms;
  }

  .label {
    grid-area: label;
    min-width: min-content;
    display: inline-flex;
    flex-direction: row;
    gap: var(--fds-spacing-1);
    cursor: pointer;
  }

  .description {
    grid-area: description;
    padding-left: 3px;
    margin-top: calc(var(--fds-spacing-2) * -1);
    color: var(--fds-semantic-text-neutral-subtle);
  }

  .readonly > .input,
  .readonly > .label {
    cursor: default;
  }

  .disabled > .input,
  .disabled > .label,
  .disabled > .description {
    color: var(--fds-semantic-border-neutral-subtle);
  }

  .disabled > .input,
  .disabled > .label {
    cursor: not-allowed;
  }

  .icon > .track {
    transition: color var(--fds-transition) ease;
    color: var(--fds-semantic-surface-neutral-dark);
  }

  .icon > .thumb {
    transition: transform var(--fds-transition) ease;
    color: var(--fds-semantic-background-default);
  }

  .icon > .thumb > .checkmark {
    opacity: 0;
    transition: opacity var(--fds-transition) ease-in-out;
    transform: translate(6px, 6px);
  }

  .input:disabled ~ .icon > .track {
    color: var(--fds-semantic-border-neutral-subtle);
  }

  .input:not([readonly], :disabled):checked ~ .icon > .track,
  .input:not([readonly], :disabled):checked ~ .icon > .thumb > .checkmark {
    opacity: 1;
    color: var(--fds-semantic-surface-success-default);
  }

  .input:checked ~ .icon > .thumb {
    transform: translateX(22px);
  }

  @media (hover: hover) and (pointer: fine) {
    .input:not([readonly], :disabled):hover ~ .icon > .thumb {
      transform: translateX(4px);
    }

    .input:not([readonly], :disabled):hover ~ .label {
      color: var(--fds-semantic-border-input-hover);
    }

    .input:not(:disabled, [readonly]):checked:hover ~ .icon > .thumb {
      transform: translateX(17px);
    }

    .input:not(:checked, :disabled, [readonly]):hover ~ .icon > .track {
      color: var(--fds-semantic-surface-neutral-dark-hover);
    }

    .input:not(:disabled, [readonly]):checked:hover ~ .icon > .track,
    .input:not(:disabled, [readonly]):checked:hover
      ~ .icon
      > .thumb
      > .checkmark {
      color: var(--fds-semantic-surface-success-hover);
    }
  }

  .readonly .input[readonly] ~ .icon > .track {
    stroke: var(--fds-semantic-border-neutral-subtle);
    color: var(--fds-semantic-background-subtle);
  }

  .readonly .input[readonly]:checked ~ .icon .thumb > .checkmark {
    opacity: 1;
    color: var(--fds-semantic-background-subtle);
  }

  .readonly .input[readonly] ~ .icon .thumb {
    color: var(--fds-semantic-border-neutral-default);
  }

  .input:focus-visible:not(:disabled) ~ .icon {
    outline: var(--fds-focus-border-width) solid
      var(--fds-outer-focus-border-color);
    outline-offset: 0;
  }

  .input:focus-visible:not(:disabled) ~ .icon .track {
    stroke: var(--fds-inner-focus-border-color);
    stroke-width: var(--fds-focus-border-width);
  }

  .padlock {
    grid-area: label;
    height: 1.2rem;
    width: 1.2rem;
  }
</style>
