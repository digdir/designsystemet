<script>
  import Cross from './Cross.svelte';

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
  export let readOnly = false;

  /**
   * ARIA label for the delete button.
   * @type {string}
   */
  export let deleteButtonLabel = 'Delete';
</script>

<div class="multiSelectedOption">
  <span class="optionLabel">{option.label}</span>
  {#if !readOnly}
    <button
      class="deleteButton"
      aria-label={deleteButtonLabel}
      on:click={() => removeOption(option)}
    >
      <Cross />
    </button>
  {/if}
</div>

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
  }

  .deleteButton {
    --delete-cross-box-border-radius: var(
      --interactive-components-border-radius-normal
    );
    --delete-cross-box-color-hover: var(--colors-red-500);
    --delete-cross-box-size: 25px;
    --delete-cross-size: 12px;
    --delete-cross-clip-path: polygon(
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
    --delete-cross-color: var(--colors-blue-900);
    --delete-cross-color-active: var(--colors-blue-700);
    --delete-cross-color-disabled: #022f5180;
    --delete-cross-color-hover: white;
    color: #fff;
    background: none;
    border-radius: var(--delete-cross-box-border-radius);
    border: none;
    cursor: var(--interactive-element-cursor);
    height: var(--delete-cross-box-size);
    padding: calc(
      (var(--delete-cross-box-size) - var(--delete-cross-size)) / 2
    );
    width: var(--delete-cross-box-size);

    &:disabled {
      --delete-cross-color: var(--delete-cross-color-disabled);

      cursor: auto;
      background-color: transparent;
    }

    &:hover:not(:disabled) {
      background-color: var(--delete-cross-box-color-hover);
    }
  }

  .optionLabel {
  }
</style>
