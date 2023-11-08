<script>
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

  /** @type {function} - Function to determine if an option is selected. */
  export let isSelected;

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

  /* $: computedOptions = options.map((option) => ({
    ...option,
    isHidden: hideSelected && isSelected(option),
    isSelected: isSelected(option),
  })); */
</script>

<div
  class="select-dropdown"
  class:visible={isDropdownVisible}
>
  <ul class="options-list">
    {#each options as option (option.value)}
      {@const selected = isSelected(option)}
      <!--{#if !selected} -->
      <li
        class="option-item"
        role="option"
        aria-selected={selected}
        on:click={(event) => {
          event.stopPropagation();
          selectOption(option);
        }}
      >
        <!-- {#if multiple}
          <input
            type="checkbox"
            class="option-checkbox"
            checked={selected}
            readonly
          />
        {/if} -->
        <div class="option-content">
          <div class="option-label">{option.label}</div>
          {#if option.description}
            <div class="option-description">{option.description}</div>
          {/if}
        </div>
      </li>
      <div class="option-separator" />
      <!--  {/if} -->
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
    padding: 9px 12px 10px 12px;
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
  /*   .option-checkbox {
    margin-right: 8px;
  } */

  .option-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .option-label {
    color: var(--semantic-text-neutral-default, #1e2b3c);
    font-weight: 400;
    line-height: 130%; /* 17.55px */
  }

  .option-separator {
    width: 100%;
    height: 1px;
    background: rgba(2, 47, 81, 0.5);
  }
</style>
