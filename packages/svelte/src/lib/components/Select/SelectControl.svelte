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
  export let disabled;
  export let error;

  const selectContext = getContext('selectContext-' + inputId);
  $: selected = $selectContext.selected;

  let inputValue = '';
  let isFiltering = false;
  let inputElement;

  // Update filter inputValue
  function updateInputValue(event) {
    inputValue = event.target.value;
    isFiltering = true;
    handleFilterChange(inputValue);
  }

  $: if (!multiple && selected !== null) {
    if (!isFiltering) {
      inputValue = selected.label;
    }
  } else if (!hasFilter) {
    inputValue = '';
  }

  function handleBlur() {
    isFiltering = false;
  }
  function handleClick() {
    handleSelectControlClick();
    if (!inputElement) return;
    inputElement.focus();
  }
  // Debounce setting the inputValue to avoid immediate reactivity
  function setSelectedValue() {
    if (!isFiltering && !multiple && selected) {
      inputValue = selected.label;
    }
  }

  $: if (selected) {
    setTimeout(setSelectedValue, 150);
  }
</script>

<div
  class="field {disabled ? 'disabled' : ''} {error ? 'error' : ''} {multiple
    ? 'multiple'
    : 'single'}"
  on:click={handleClick}
>
  <div class="input-container">
    {#if multiple}
      <div class="selected-options">
        {#each selected as selectedOption (selectedOption.value)}
          <MultiSelectOption
            option={selectedOption}
            {removeOption}
            {readOnly}
            {disabled}
          />
        {/each}
      </div>
    {/if}
    <input
      bind:this={inputElement}
      bind:value={inputValue}
      on:input={updateInputValue}
      on:blur={handleBlur}
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
    <ClearButton
      handleClick={clearAll}
      {disabled}
    />
  {/if}
  <hl class="separator {disabled ? 'disabled' : ''}" />
  <div class={`chevron-container ${disabled ? 'disabled' : ''}`}>
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

    &.disabled {
      color: lightgrey;
    }
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

    &.disabled {
      border: 1px solid lightgrey;
    }
    &.error {
      border: 1px solid var(--fds-semantic-border-danger-default);
    }
  }

  .separator {
    width: 1px;
    height: 1.5rem;
    background: var(--interface-common-info-900, #022f51);
    margin-right: 0.25rem;
    margin-left: 0.125rem;
    &.disabled {
      background: lightgrey;
    }
  }
</style>
