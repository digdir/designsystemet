<!-- TabItem.svelte -->
<script>
  import { selectedTab, tabSize } from './store.js';

  /**
   * Value of the tab.
   */
  export let value;

  /**
   * Icon to be displayed in the tab.
   */
  export let icon = null;

  let tabButtonSize;
  let isSelected;

  // Abonner på selectedTab store
  $: isSelected = $selectedTab && $selectedTab === value;
  $: tabButtonSize = $tabSize;

  function handleClick() {
    $selectedTab = value;
  }
</script>

<div class="tab-item {isSelected ? 'selected' : ''}">
  <button
    class={`${isSelected ? 'active' : ''} ${tabButtonSize} ${!icon ? 'no-icon' : ''}`}
    on:click={handleClick}
  >
    {#if icon}
      <div class="icon">{@html icon}</div>
    {/if}
    <div class="text">
      <slot />
    </div>
  </button>
</div>

<style lang="scss">
  .tab-item {
    font-family: inherit;
    display: inline-flex;
    flex-direction: row;
    border-bottom: var(--fds-border_width-default) solid
      var(--fds-semantic-border-neutral-subtle);
    margin-left: -4px;
  }

  button {
    font-family: inherit;
    display: flex;
    padding: var(--spacing-3, 0.84375rem) var(--spacing-5, 1.40625rem);
    justify-content: center;
    align-items: center;
    gap: var(--spacing-2, 0.5625rem);
    border: none;
    border-radius: 0;
    background-color: transparent;
    cursor: pointer;
    position: relative;
    color: var(--semantic-text-neutral-default, #1e2b3c);

    &.small {
      font-size: 0.9375rem;
      padding: var(--spacing-2, 0.5625rem) var(--spacing-4, 1.125rem);
    }
    &.medium {
      font-size: 1.125rem;
      padding: var(--spacing-3, 0.84375rem) var(--spacing-5, 1.40625rem);
    }
    &.large {
      font-size: 1.3125rem;
      padding: var(--spacing-4, 1.125rem) var(--spacing-6, 1.6875rem);
    }
  }

  .icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: .1875rem;
    scale: 1.4;
  }
  .no-icon {
    margin-bottom: -.125rem;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover {
      --fdsc-bottom-border-color: var(--fds-semantic-border-neutral-subtle);

      color: var(--fds-semantic-text-neutral-default);
    }
  }

  button.active {
    --fdsc-bottom-border-color: var(--fds-semantic-border-action-default);

    color: var(--fds-semantic-text-action-default);
  }

  button:focus-visible {
    --fdsc-bottom-border-color: var(--fds-semantic-text-neutral-default);

    background: var(--fds-semantic-border-focus-outline);
    color: var(--fds-semantic-text-neutral-default);
    outline: none;
  }

  button::after {
    content: '';
    display: block;
    height: .1875rem;
    width: 100%;
    border-radius: var(--fds-border_radius-full);
    background-color: var(--fdsc-bottom-border-color);
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>
