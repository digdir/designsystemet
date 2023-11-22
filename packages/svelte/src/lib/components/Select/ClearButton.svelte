<script>
  import Cross from './Cross.svelte';

  export let handleClick;
  export let deleteButtonLabel = 'Delete';
  export let disabled;
</script>

<button
  on:click={disabled ? null : handleClick}
  aria-label={deleteButtonLabel}
  class={`delete-button clear-all ${disabled ? 'disabled' : ''}`}
  {disabled}><Cross /></button
>

<style>
  .delete-button {
    --delete-cross-box-border-radius: var(
      --interactive-components-border-radius-normal
    );
    --delete-cross-box-color-hover: var(--colors-red-500);
    --delete-cross-box-size: 25px;
    --delete-cross-size: 12px;

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
      background-color: var(--colors-red-500);
      &.clear-all {
        background-color: var(--colors-red-500);
        color: white;
      }
    }

    &.clear-all {
      color: inherit;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      margin-left: auto;
      background-color: transparent;
      &:disabled {
        color: lightgrey;
      }
    }
  }
</style>
