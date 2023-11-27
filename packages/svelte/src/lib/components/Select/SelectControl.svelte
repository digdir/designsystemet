<script>
  import { getContext, onMount } from 'svelte';

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
  export let handleFilterChange;
  export let searchLabel;
  export let disabled;
  export let error;
  export let clearAll;

  const selectContext = getContext('selectContext-' + inputId);
  $: selected = $selectContext.selected;

  let inputValue = '';
  let isFiltering = false;
  let inputElement;
  let initialized = false;

  onMount(() => {
    if (!multiple && selected && selected.length > 0) {
      inputValue = selected[0].label;
    }
    initialized = true;
  });

  let debounceTimer;
  function updateInputValue(event) {
    const value = event.target.value;
    isFiltering = true;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      inputValue = value;
      handleFilterChange(value);
    }, 150);
  }

  function handleBlur() {
    isFiltering = false;
  }

  function handleClick() {
    handleSelectControlClick();
    if (!inputElement) return;
    inputElement.focus();
  }

  function updateValue() {
    if (initialized && !isFiltering && !multiple && selected) {
      inputValue = selected.label;
    }
  }

  function handleClearAll() {
    if (multiple) {
      clearAll();
    }
    if (hasFilter && inputValue) {
      inputValue = '';
      handleFilterChange('');
    }
  }

  $: if (!multiple && selected !== null) {
    if (!isFiltering) {
      inputValue = selected.label;
    }
  } else if (!hasFilter) {
    inputValue = '';
  }

  $: {
    if (!multiple) {
      if (selected && selected.length > 0 && !isFiltering) {
        inputValue = selected[0].label;
      } else if (!hasFilter) {
        inputValue = '';
      }
    }
    updateValue();
  }
</script>

<div
  class="field {disabled ? 'disabled' : ''} {error ? 'error' : ''} {readOnly
    ? 'read-only'
    : ''} {multiple ? 'multiple' : 'single'}"
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
        {#if !(disabled || readOnly) && (hasFilter || selected.length === 0)}
          <input
            bind:this={inputElement}
            bind:value={inputValue}
            on:input={updateInputValue}
            on:blur={handleBlur}
            class="textInput {hasFilter ? '' : 'no-filter'}"
            id={inputId}
            placeholder={multiple &&
            !hasFilter &&
            selected &&
            selected.length > 0
              ? ''
              : placeholder}
            aria-label={searchLabel}
            readonly={readOnly || (!multiple && !hasFilter)}
          />
        {/if}
      </div>
    {/if}
    {#if !multiple}
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
    {/if}
  </div>
  {#if multiple && selected.length > 0}
    <ClearButton
      handleClick={handleClearAll}
      {disabled}
    />
  {/if}
  <div class="separator {disabled ? 'disabled' : ''}" />
  <div class={`chevron-container ${disabled ? 'disabled' : ''}`}>
    <Chevron />
  </div>
</div>

<style lang="scss">
  .input-container {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    overflow: hidden;
  }

  .textInput {
    background: transparent;
    border: 0;
    box-sizing: border-box;
    font-family: inherit;
    font-size: var(--font_size);
    line-height: var(--line-height);
    min-height: var(--field-height-inside);
    outline: none;
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
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
    align-items: center;
    flex-direction: row;
    font-family: inherit;
    font-size: var(--font_size);
    min-height: 1.75rem;
    padding: 0.25rem 0;
    &:hover {
      cursor: pointer;
      &.read-only {
        cursor: not-allowed;
      }
      &.disabled {
        cursor: not-allowed;
      }
    }

    &.disabled {
      border: 1px solid lightgrey;
    }
    &.error {
      border: 1px solid var(--fds-semantic-border-danger-default);
    }
    &.read-only {
      border: 1px solid rgb(194, 194, 194);
      background-color: rgb(235, 235, 235);
    }
  }

  .separator {
    width: 1px;
    align-self: stretch;
    background: var(--interface-common-info-900, #022f51);
    margin-right: 0.25rem;
    margin-left: 0.125rem;
    &.disabled {
      background: lightgrey;
    }
  }
</style>
