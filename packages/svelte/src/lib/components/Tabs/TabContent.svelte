<!-- TabContent.svelte -->
<script>
  import { selectedTab, tabSize } from './store.js';

  /**
   * Value of the tab content.
   */
  export let value;

  let tabContentSize = $tabSize;
</script>

{#if $selectedTab === value}
  <div class={`tab-content ${tabContentSize}`}>
    <slot />
  </div>
{/if}

<style lang="scss">
  .tab-content {
    color: var(--semantic-text-neutral-default, #1e2b3c);
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 1.40625rem */
    margin-left: -.125rem;
    &.small {
      padding: var(--spacing-4, 1.125rem);
      font-size: 0.9375rem;
    }
    &.medium {
      padding: var(--spacing-5, 1.40625rem);
      font-size: 1.125rem;
    }
    &.large {
      padding: var(--spacing-6, 1.6875rem);
      font-size: 1.3125rem;
    }
  }
</style>
