<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import SelectControl from './SelectControl.svelte';
  import SelectDropdown from './SelectDropdown.svelte';

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
   * @type {Error | null}
   */
  export let error = null;

  /**
   * @type {boolean}
   */
  export let readOnly = false;

  $: isDropdownVisible = false;
  let selectClasses = 'select';
  let inputClasses = 'textInput';
  let errorText = '';
  let node;

  /*   function toggleDropdown() {
    if (!disabled && !readOnly) {
      isDropdownVisible = !isDropdownVisible;
    }
  } */

  function closeDropdown() {
    isDropdownVisible = false;
  }

  function selectOption(option) {
    if (multiple) {
      if (Array.isArray(selected)) {
        if (
          !selected.some(
            (selectedOption) => selectedOption.value === option.value,
          )
        ) {
          selected = [...selected, option];
        } else {
          selected = [
            ...selected.filter(
              (selectedOption) => selectedOption.value !== option.value,
            ),
          ];
        }
      } else {
        selected = [option];
      }
    } else {
      selected = option;
    }
    if (closeMenuOnSelect) {
      isDropdownVisible = false;
    }
  }

  function removeOption(optionToRemove) {
    if (multiple && Array.isArray(selected)) {
      selected = selected.filter(
        (option) => option.value !== optionToRemove.value,
      );
    } else {
      selected = null;
    }
  }

  function isSelected(option) {
    if (multiple) {
      return (
        Array.isArray(selected) &&
        selected.some((selectedOption) => selectedOption.value === option.value)
      );
    } else {
      return selected && 'value' in selected && selected.value === option.value;
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

  function clearAll() {
    if (multiple) {
      selected = [];
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
    errorText = error.message;
  } else {
    selectClasses = 'select';
  }

  let searchTerm = '';

  /*  $: filteredOptions = options.filter((option) => {
    return (
      (!hideSelected || !isSelected(option)) &&
      (!searchTerm ||
        option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }); */
</script>

<div
  bind:this={node}
  class="select-container"
>
  {#if label}
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
    {ariaLabel}
    {hasFilter}
    {searchTerm}
    {searchLabel}
    {selected}
    {readOnly}
    {removeOption}
    {multiple}
    {handleSelectControlClick}
    {clearAll}
  />

  <div class="dropdown-container">
    <SelectDropdown
      {isDropdownVisible}
      {options}
      {selectOption}
      {isSelected}
      {hideSelected}
      {multiple}
    />
  </div>
  {#if error}
    <p class="errorText">{errorText}</p>
  {/if}
</div>

<style lang="scss">
  /* .select {
    --delete_cross_box-border_radius: var(
      --interactive_components-border_radius-normal
    );
    --delete_cross_box-color-hover: var(--colors-red-500);
    --delete_cross_box-size: 25px;
    --delete_cross-clip_path: polygon(
      14.29% 0%,
      50% 35.71%,
      85.71% 0%,
      100% 14.29%,
      64.29% 50%,
      100% 85.71%,
      85.71% 100%,
      50% 64.29%,
      14.29% 100%,
      0% 85.71%,
      35.71% 50%,
      0% 14.29%
    );
    --delete_cross-color: var(--colors-blue-900);
    --delete_cross-color-active: var(--colors-blue-700);
    --delete_cross-color-disabled: #022f5180;
    --delete_cross-color-hover: white;
    --delete_cross-size: 12px;
    --arrow-border_left: 1px solid #022f5180;
    --arrow-color: var(--colors-blue-900);
    --arrow-height_to_width_fraction: calc(8 / 14);
    --arrow-horizontal_padding: 6px;
    --arrow-size: 14px;
    --arrow_wrapper-margin: 4px;
    --field-height-inside: calc(
      var(--field-height) - var(--component-input-border_width-default) * 2
    );
    --field-height: var(--component-input-size-min_height-default);
    --font_size: 1rem;
    --interactive_element-cursor: pointer;
    --line-height: 1.5;
    --multiselect_item-background_color: var(--colors-blue-900);
    --multiselect_item-height: 24px;
    --multiselect_item-space_between: 6px;
    --multiselect_item-space_left: 16px;
    --multiselect_item-text_color: white;
    --multiselect_item_delete_cross-color: white;
    --multiselect_items-gap: 4px;
    --multiselect_items-padding: calc(
      (var(--field-height-inside) - var(--multiselect_item-height)) / 2
    );
    --singleselect_field-padding_left: 12px;
    --focus_visible-outline: var(--semantic-tab_focus-outline-width) auto
      var(--semantic-tab_focus-outline-color);

    font-size: var(--font_size);
    line-height: var(--line-height);
  }

  .select.disabled {
    --interactive_element-cursor: auto;

    opacity: var(--opacity-disabled);
  }

  .fieldButton {
    background: transparent;
    border: 0;
    cursor: var(--interactive_element-cursor);
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .field {
    display: inline-flex;
    align-items: center;
    flex-direction: row;
    font-family: inherit;
    font-size: var(--font_size);
    min-height: var(--field-height);
    width: 100%;
  }

  .inputArea {
    align-items: center;
    display: flex;
    flex: 1;
    height: 100%;
    position: relative;
  }

  .select.multiple .inputArea {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1;
    gap: var(--multiselect_items-gap);
    padding: var(--multiselect_items-padding);
  }

  .select.single .field.hasIcon .inputArea {
    padding-left: var(--icon-width);
  }

  .select.multiple .field.hasIcon .inputArea {
    padding-left: calc(var(--multiselect_items-padding) + var(--icon-width));
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
  }

  .select.single .textInput {
    cursor: var(--interactive_element-cursor);
    padding: 0 0 0 var(--singleselect_field-padding_left);
    position: absolute;
    width: 100%;
  }

  .select.multiple .textInput {
    flex: 1;
    min-height: 0;
    min-width: 3rem;
    padding: 0;
  }

  .select.multiple .fieldButton:focus-visible {
    outline: var(--focus_visible-outline);
  }

  .arrowWrapper {
    --arrow-height: calc(
      var(--arrow-size) * var(--arrow-height_to_width_fraction)
    );
    --arrow-vertical_padding: calc(
      (var(--field-height-inside) - var(--arrow-height)) / 2 -
        var(--arrow_wrapper-margin)
    );

    align-items: center;
    border-left: var(--arrow-border_left);
    box-sizing: border-box;
    display: flex;
    height: calc(100% - var(--arrow-vertical_padding));
    margin-bottom: var(--arrow_wrapper-margin);
    margin-left: var(--arrow_wrapper-margin);
    margin-top: var(--arrow_wrapper-margin);
    padding: var(--arrow-vertical_padding) var(--arrow-horizontal_padding);
  }

  .arrow {
    background-color: var(--arrow-color);
    clip-path: polygon(
      11.72% 9.93%,
      50% 67.28%,
      88.28% 9.93%,
      97.43% 29.13%,
      50% 96.79%,
      2.57% 29.13%
    );
    display: inline-block;
    height: var(--arrow-height);
    width: var(--arrow-size);
  }

  .select.multiple .deleteButton {
    background: none;
    border-radius: var(--delete_cross_box-border_radius);
    border: none;
    cursor: var(--interactive_element-cursor);
    height: var(--delete_cross_box-size);
    padding: calc(
      (var(--delete_cross_box-size) - var(--delete_cross-size)) / 2
    );
    width: var(--delete_cross_box-size);
  }

  .select.multiple .deleteButton:disabled {
    --delete_cross-color: var(--delete_cross-color-disabled);

    cursor: auto;
    background-color: transparent;
  }

  .select.multiple .deleteButton:hover:not(:disabled) {
    background-color: var(--delete_cross_box-color-hover);

    --delete_cross-color: var(--delete_cross-color-hover);
  }

  .select.multiple .deleteButtonCross {
    background-color: var(--delete_cross-color);
    clip-path: var(--delete_cross-clip_path);
    display: inline-block;
    height: var(--delete_cross-size);
    width: var(--delete_cross-size);
  }

  .select.expanded {
    --delete_cross-color: var(--delete_cross-color-active);
  }

  .filterInput {
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    font-size: 1rem;
  } */

  .select-container {
    position: relative;
    margin-bottom: 1rem;
    width: auto;
  }

  .dropdown-container {
    position: absolute;
    width: 100%;
    top: 100%;
    left: 0;
    z-index: 1000;
  }

  .select-label {
    color: var(--semantic-text-neutral-default, #1e2b3c);
    font-family: Inter;
    font-size: 1rem;
    font-weight: 500;
    line-height: 130%; /* 20.15px */
  }
</style>
