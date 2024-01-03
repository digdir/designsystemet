<script>
  import SelectCheckmark from './SelectCheckmark.svelte';
  import { getContext } from 'svelte';

  /**
   * @typedef {Object} SelectOption
   * @property {string} label - Display label of the option.
   * @property {string} [description] - Description of the option.
   * @property {string} value - Unique value of the option.
   */

  /**
   * List of options for the select.
   * @type {SelectOption[]}
   */
  export let options;
  /** @type {function} - Function to handle option selection. */
  export let selectOption;

  /**
   * Whether the dropdown is visible.
   * @type {boolean}
   */
  export let isDropdownVisible;

  export let multiple;

  /**
   * If true, hides selected options from the dropdown list.
   * @type {boolean}
   */
  //svelte-ignore unused-export-let
  export let hideSelected = false;
  //svelte-ignore unused-export-let
  export let size = 'medium';
  export let inputId;

  const selectContext = getContext('selectContext-' + inputId);

  $: selected = $selectContext.selected;
  $: error = $selectContext.error;

  $: isOptionSelected = (option) => {
    if (Array.isArray(selected)) {
      // Handling for multiple select
      return selected.some((sel) => sel.value === option.value);
    } else {
      // Handling for single select
      return selected && selected.value === option.value;
    }
  };
</script>

<div
  class="select-dropdown"
  class:visible={isDropdownVisible}
>
  <ul class="options-list">
    {#each options as option, index (index)}
      {@const isSelected = isOptionSelected(option)}

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="option-item"
        role="option"
        aria-selected={isSelected}
        on:click={(event) => {
          event.stopPropagation();
          selectOption(option);
        }}
      >
        <div class="option-content">
          {#if multiple}
            <div class="checkbox-container">
              <input
                class="input"
                type="checkbox"
                checked={isSelected}
              />
              <svg
                class="icon icon-xsmall"
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
            </div>
          {/if}
          <div class="option-text">
            <div class="option-label">{option.label}</div>
            {#if option.description}
              <div class="option-description">{option.description}</div>
            {/if}
            {#if !multiple && isSelected}
              <div class="checkmark-container">
                <SelectCheckmark />
              </div>
            {/if}
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .select-dropdown {
    background-color: var(--fds-semantic-background-default, #ffffff);
    border-radius: 3px;
    border: 1px solid var(--colors-grey-600, #68707c);
    box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.25);
    &:not(.visible) {
      display: none;
    }
    max-height: 400px;
    overflow-y: auto;
    margin-top: var(--fds-spacing-1);
    padding: var(--spacing-2, 9px);
  }
  .options-list {
    max-width: 100%;
    z-index: 1001;
    background-color: inherit;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    opacity: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1 0 0;
    padding: 0;
    margin: 0;
  }

  .option-item {
    display: flex;
    padding: 9px 12px;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    list-style: none;
    &:hover {
      background: var(
        --fds-semantic-surface-action-first-subtle-hover,
        #c8cbdc
      );
      border-radius: var(--fds-border_radius-interactive, 4px);
      border-left: 5px solid var(--fds-semantic-border-action-hover, #3c4a71);
      cursor: pointer;
      padding: 9px 12px 9px 7.5px;
    }
  }

  .option-item:hover rect {
    stroke: var(--fds-semantic-border-input-hover) !important;
  }

  .option-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .option-content {
    display: flex;
    align-items: start;
    width: 100%;
    position: relative;
    gap: 10px;
    margin-top: 2px;
  }

  .option-label {
    color: var(--semantic-text-neutral-default, #1e2b3c);
    font-weight: 400;
    line-height: 130%; /* 17.55px */
  }

  .option-label,
  .option-description {
    margin-right: auto;
  }

  .checkmark-container {
    position: absolute;
    right: 0;
    padding-right: 10px;
    margin-top: 2px;
  }

  .icon {
    grid-area: input;
    pointer-events: none;
    height: 1.75rem;
    width: 1.75rem;
    overflow: visible;
  }

  .input {
    position: absolute;
    opacity: 0;
    margin: 0;
    grid-area: input;
    cursor: pointer;
  }

  .input:not(:checked) ~ .icon .checked {
    display: none;
  }

  .input:checked ~ .icon .checked {
    display: inline;
  }

  .input:not(:checked) ~ .icon .box {
    stroke: var(--fds-semsemantic-border-input-default, #00244e);
    fill: var(--fds-semantic-surface-action-no_fill, #ffffff);
  }

  .input:disabled ~ .icon .box {
    stroke: var(--fds-semantic-border-neutral-subtle, #d2d5d8);
    fill: var(--fds-semantic-surface-action-no_fill, #ffffff);
  }

  .input:checked:not(:disabled) ~ .icon .box {
    stroke: var(--fds-semantic-surface-action-checked);
    fill: var(--fds-semantic-surface-action-checked);
  }

  .input:focus-visible ~ .icon {
    outline: var(--fds-focus-border-width) solid
      var(--fds-semantic-border-focus-outline, #ffda06);
    outline-offset: 0;
  }

  .input:focus-visible:not(:disabled) ~ .icon .box {
    stroke: var(--fds-semantic-border-focus-boxshadow, #00244e);
    stroke-width: var(--fds-focus-border-width);
  }

  .input:disabled ~ .icon .checked {
    fill: var(--fds-semantic-border-neutral-default, #bfc2c0);
  }

  .icon-xsmall {
    height: 1.2rem;
    width: 1.2rem;
  }
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--fds-brand-grey-100);
  }
  ::-webkit-scrollbar-thumb {
    border: 3px solid transparent;
    background-clip: padding-box;
    border-radius: 50px;
    background-color: var(--fds-brand-grey-700);
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--fds-brand-grey-900);
  }
</style>
