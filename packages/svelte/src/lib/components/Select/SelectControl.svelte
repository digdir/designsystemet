<script>
  import { getContext } from 'svelte';

  import MultiSelectOption from './MultiSelectOption.svelte';
  import Chevron from './Chevron.svelte';
  import ClearButton from './ClearButton.svelte';

  export let multiple;
  export let inputId;
  export let placeholder;
  export let hasFilter;
  export let readOnly;
  export let removeOption;
  export let handleSelectControlClick;
  export let clearAll;
  export let handleFilterChange;
  export let searchLabel;

  const selectContext = getContext('selectContext-' + inputId);
  $: selected = $selectContext.selected;

  let inputValue = '';

  // Update filter inputValue
  function updateInputValue(event) {
    inputValue = event.target.value;
    handleFilterChange(inputValue);
  }

  // Existing logic to update inputValue based on selected option
  $: if (!multiple && selected.length > 0) {
    inputValue = selected[0].label;
  } else if (!hasFilter) {
    inputValue = '';
  }
</script>

<div
  class="field {multiple ? 'multiple' : 'single'}"
  on:click={handleSelectControlClick}
>
  <div class="input-container">
    {#if multiple}
      <div class="selected-options">
        {#each selected as selectedOption (selectedOption.value)}
          <MultiSelectOption
            option={selectedOption}
            {removeOption}
            {readOnly}
          />
        {/each}
      </div>
    {/if}
    <input
      bind:value={inputValue}
      on:input={updateInputValue}
      class="textInput {hasFilter ? '' : 'no-filter'}"
      id={inputId}
      placeholder={multiple && !hasFilter && selected && selected.length > 0
        ? ''
        : placeholder}
      aria-label={searchLabel}
      readonly={readOnly || (!multiple && !hasFilter)}
    />
  </div>
  {#if multiple && selected.length > 0}
    <ClearButton handleClick={clearAll} />
  {/if}
  <div class="chevron-container">
    <Chevron />
  </div>
</div>

<style lang="scss">
  .input-container {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .textInput {
    background: transparent;
    border: 0;
    box-sizing: border-box;
    font-family: inherit;
    font-size: var(--font_size);
    line-height: var(--line-height);
    min-height: var(--field-height-inside);
    max-width: 100%;
    outline: none;
    &.no-filter {
      cursor: pointer;
    }
  }

  .chevron-container {
    height: 100%;
    display: flex;
    align-items: center;
    gap: var(--fds-spacing-2);
    margin-right: var(--fds-spacing-1);
  }

  .selected-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fds-spacing-2);
  }

  .clearAll {
    background: #f0f0f0;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    margin-left: auto;
  }

  .field {
    display: flex;
    border: 1px solid var(--interface-common-info-900, #022f51);
    border-radius: 3px;
    background: fff;
    display: flex;
    align-items: center;
    flex-direction: row;
    font-family: inherit;
    font-size: var(--font_size);
    min-height: 1.75rem;
    width: 100%;
    padding: 0.25rem 0;
    &:hover {
      cursor: pointer;
    }
  }
</style>
