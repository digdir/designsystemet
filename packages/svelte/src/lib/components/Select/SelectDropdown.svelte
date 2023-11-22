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

  /**
   * If true, hides selected options from the dropdown list.
   * @type {boolean}
   */
  export let hideSelected;
  export let multiple;

  export let inputId;

  const selectContext = getContext('selectContext-' + inputId);

  $: selected = $selectContext.selected;
  $: error = $selectContext.error;

  /* $: computedOptions = options.map((option) => ({
    ...option,
    isHidden: hideSelected && isSelected(option),
    isSelected: isSelected(option),
  })); */

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
      <!--{#if !selected} -->
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
                type="checkbox"
                checked={isSelected}
              />
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
    /* border-bottom: solid 1px rgba(2, 47, 81, 0.5); */
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
  }

  .option-separator {
    width: 100%;
    height: 1px;
    background: rgba(2, 47, 81, 0.5);
  }
</style>
