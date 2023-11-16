<script>
  import Cross from './Cross.svelte';
  import ClearButton from './ClearButton.svelte';

  /**
   * Represents an option in a multi-select dropdown.
   * @property {string} label - Display label of the option.
   * @property {string} value - Unique value of the option.
   */
  export let option;

  /**
   * Function to remove the selected option.
   * @type {Function}
   */
  export let removeOption;

  /**
   * If true, disables the removal of the option.
   * @type {boolean}
   */
  export let readOnly;

  /**
   * ARIA label for the delete button.
   * @type {string}
   */
  export let deleteButtonLabel = 'Slett';
</script>

<span class="multiSelectedOption">
  <span class="optionLabel">{option.label}</span>
  {#if !readOnly}
    <span class="delete-button-container">
      <button
        on:click={() => removeOption(option)}
        aria-label={`${deleteButtonLabel} ${option.label}`}
        class={'delete-button'}><Cross /></button
      >
    </span>
  {/if}
</span>

<style lang="scss">
  .multiSelectedOption {
    display: flex;
    align-items: center;
    color: #fff;
    border-radius: var(--border-radius-full, 9999px);
    background: var(--semantic-surface-action-primary-active, #00315d);
    padding: var(--fds-spacing-1) var(--fds-spacing-2);
    gap: var(--fds-spacing-2);
    --interactive-element-cursor: pointer;
    position: relative;
  }

  .optionLabel {
    flex-grow: 1;
    padding-right: var(--fds-spacing-6);
  }

  .delete-button-container {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: var(--fds-spacing-2);
    border-radius: var(--border-radius-full, 9999px);

    &:hover {
      background-color: var(--colors-red-500);
      cursor: pointer;
    }
  }

  .delete-button {
    --delete-cross-box-color-hover: var(--colors-red-500);
    --delete-cross-box-size: 25px;
    --delete-cross-size: 12px;

    --delete-cross-color: var(--colors-blue-900);
    --delete-cross-color-disabled: #022f5180;
    color: #fff;
    background: transparent;
    border-radius: var(--interactive-components-border-radius-normal);
    border: none;
    cursor: var(--interactive-element-cursor);
    height: var(--delete-cross-box-size);
    width: var(--delete-cross-box-size);
    padding: calc(
      (var(--delete-cross-box-size) - var(--delete-cross-size)) / 2
    );

    &:disabled {
      --delete-cross-color: var(--delete-cross-color-disabled);
    }

    right: 0;
    border: none;
    padding: 0;

    &:hover {
      background: var(--colors-red-500);
    }
  }
</style>
