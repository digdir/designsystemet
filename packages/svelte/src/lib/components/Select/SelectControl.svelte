<script>
  import MultiSelectOption from './MultiSelectOption.svelte';
  import SingleSelectOption from './SingleSelectOption.svelte';
  import Chevron from './Chevron.svelte';

  export let multiple = false;
  export let inputId;
  export let placeholder;
  export let ariaLabel;
  export let hasFilter;
  export let searchTerm;
  export let searchLabel;
  export let selected;
  export let readOnly = false;
  export let removeOption;
  export let handleSelectControlClick;
  export let clearAll;
</script>

<div
  class="field {multiple ? 'multiple' : 'single'}"
  on:click={handleSelectControlClick}
>
  <div class="inputContainer">
    {#if hasFilter}
      <input
        bind:value={searchTerm}
        class="filterInput"
        placeholder={searchLabel}
        aria-label={searchLabel}
      />
    {/if}
    {#if multiple}
      <div class="selectedOptions">
        {#each selected as selectedOption (selectedOption.value)}
          <MultiSelectOption
            option={selectedOption}
            {removeOption}
            {readOnly}
          />
        {/each}
      </div>
      <!-- Add Clear All Button here if required -->
    {:else if selected}
      <SingleSelectOption option={selected} />
    {:else}
      <input
        class="textInput"
        id={inputId}
        {placeholder}
        aria-label={ariaLabel}
        readonly
      />
    {/if}
  </div>
  <div class="controlIcons">
    {#if multiple && selected.length > 0}
      <button
        class="clearAll"
        on:click={clearAll}>X</button
      >
    {/if}
    <Chevron />
  </div>
</div>

<style lang="scss">
  .inputContainer {
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
  }

  .controlIcons {
    display: flex;
    align-items: center;
    gap: var(--fds-spacing-2);
    margin-right: var(--fds-spacing-1);
  }

  .selectedOptions {
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
    padding: 0.25rem;
    &:hover {
      cursor: pointer;
    }
  }
</style>
