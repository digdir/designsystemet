<script>
  // @ts-nocheck
  import { onMount, setContext } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import SelectControl from './SelectControl.svelte';
  import SelectDropdown from './SelectDropdown.svelte';
  import { writable } from 'svelte/store';

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
  export let options = [];

  /**
   * Currently selected option(s).
   * @type {SelectOption |  SelectOption[] | null}
   */
  export let selected = null;

  /**
   * If true, allows multiple options to be selected.
   * @type {boolean}
   */
  export let multiple = false;

  /**
   * If true, disables any interaction with the select.
   * @type {boolean}
   */
  export let disabled = false;

  /**
   * Placeholder text for the select input.
   * @type {string}
   */
  export let placeholder = 'Select an option...';

  /**
   * Description text for the select.
   * @type {string}
   */
  export let description = '';

  /**
   * ARIA label for accessibility.
   * @type {string}
   */
  export let ariaLabel = 'Select';

  let inputId = `select-${uuidv4()}`;

  /**
   * Label for the select.
   * @type {string}
   */
  export let label;

  /**
   * ARIA label for the search input inside the select.
   * @type {string}
   */
  export let searchLabel = 'Search';

  /**
   * Label for the delete button in multi-select mode.
   * @type {string}
   */
  export let deleteButtonLabel = 'Delete';

  /**
   * If true, hides selected options from the dropdown list.
   * @type {boolean}
   */
  export let hideSelected = true; //multiple ? true : false;

  /**
   * If true, enables the search/filter input inside the dropdown.
   * @type {boolean}
   */
  export let hasFilter = false;

  /**
   * If true, closes the dropdown menu when an option is selected. Default true if single, default false if multiple.
   * @type {boolean}
   */
  export let closeMenuOnSelect = multiple ? false : true;

  /**
   * @type {string}
   */
  export let error = '';

  /**
   * @type {boolean}
   */
  export let readOnly = false;

  $: isDropdownVisible = false;
  let selectClasses = 'select';
  let inputClasses = 'textInput';
  let node;

  let selectedStore = writable(normalizeSelected(selected));

  // Add other values here if necessary for reactivity
  const selectContext = writable({
    selected: $selectedStore,
    error,
    multiple,
  });

  setContext('selectContext-' + inputId, selectContext);
  $: selectContext.set({ selected: $selectedStore, error, multiple });

  function closeDropdown() {
    isDropdownVisible = false;
  }

  function normalizeSelected(selectedOptions) {
    if (!selectedOptions) return [];
    return Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
  }

  function selectOption(option) {
    selectedStore.update((currentSelected) => {
      if (multiple) {
        // If multiple selections are allowed
        if (Array.isArray(currentSelected)) {
          if (
            !currentSelected.some(
              (selectedOption) => selectedOption.value === option.value,
            )
          ) {
            // Add the option if it's not already selected
            return [...currentSelected, option];
          } else {
            // Remove the option if it's already selected
            return currentSelected.filter(
              (selectedOption) => selectedOption.value !== option.value,
            );
          }
        } else {
          // If currently selected is not an array, start a new array with the option
          return [option];
        }
      } else {
        // Clear options filter on single selection
        handleFilterChange('');
        // If only single selection is allowed
        return option;
      }
    });

    selected = $selectedStore;

    if (closeMenuOnSelect) {
      isDropdownVisible = false;
    }
  }

  function removeOption(optionToRemove) {
    selectedStore.update((currentSelected) => {
      if (multiple) {
        return currentSelected.filter(
          (option) => option.value !== optionToRemove.value,
        );
      } else {
        return [];
      }
    });
  }

  function clearAll() {
    if (multiple) {
      selectedStore.set([]);
      selectContext.update((ctx) => ({ ...ctx, selected: [] }));
    }
  }

  function openDropdown() {
    if (!disabled && !readOnly) {
      isDropdownVisible = true;
    }
  }

  function handleOutsideClick(event) {
    if (isDropdownVisible && !event.composedPath().includes(node)) {
      closeDropdown();
    }
  }

  function handleSelectControlClick() {
    if (isDropdownVisible) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  onMount(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  });

  $: if (disabled) {
    selectClasses = 'select disabled';
    inputClasses += ' disabled';
  } else if (readOnly) {
    selectClasses = 'select readOnly';
    inputClasses += ' readOnly';
  } else if (error) {
    selectClasses = 'select error';
    inputClasses += ' error';
  } else {
    selectClasses = 'select';
  }

  let searchTerm = '';
  $: filteredOptions = options;

  function handleFilterChange(newFilter) {
    searchTerm = newFilter;
    filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
</script>

<div
  bind:this={node}
  class="select-container"
  aria-label={ariaLabel}
>
  {#if label}
    {#if readOnly}🔒{/if}
    <label
      class="select-label"
      for={inputId}>{label}</label
    >
  {/if}

  {#if description}
    <p class="select-description">{description}</p>
  {/if}

  <SelectControl
    {inputId}
    {placeholder}
    {hasFilter}
    {readOnly}
    {removeOption}
    {multiple}
    {handleSelectControlClick}
    {handleFilterChange}
    {searchLabel}
    {disabled}
    {error}
    {clearAll}
  />

  <SelectDropdown
    {isDropdownVisible}
    options={filteredOptions}
    {selectOption}
    {hideSelected}
    {multiple}
    {inputId}
  />
  {#if error}
    <div class="error-message">{error}</div>
  {/if}
</div>

<style lang="scss">
  .error-message {
    color: var(--fds-semantic-border-danger-default);
  }

  .select-container {
  }

  .select-label {
    color: var(--semantic-text-neutral-default, #1e2b3c);
    font-size: 1rem;
    font-weight: 600;
    line-height: 130%; /* 20.15px */
  }
</style>
