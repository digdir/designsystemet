<script>
  import Checkbox from '../Form/Checkbox/Checkbox.svelte';
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
    {#each options as option (option.value)}
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
          </div>
          {#if !multiple && isSelected}
            <div class="checkmark-container">
              <SelectCheckmark />
            </div>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .select-dropdown {
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid var(--colors-grey-600, #68707c);
    box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.25);
    &:not(.visible) {
      display: none;
    }
    min-width: 100%;
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
  }

  .option-item {
    display: flex;
    padding: 9px 12px;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    list-style: none;
    &:hover {
      background: var(--interface-common-info-200, #e3f7ff);
      cursor: pointer;
    }
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
    margin-left: auto;
    padding-right: 10px;
  }

  .checkbox-container {
    padding-right: 10px;
    height: 0;
  }

  .icon {
    grid-area: input;
    pointer-events: none;
    height: 1.75rem;
    width: 1.75rem;
    margin: auto;
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

  .icon-xsmall {
    height: 1.2rem;
    width: 1.2rem;
  }
</style>
