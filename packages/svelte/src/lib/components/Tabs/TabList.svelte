<!-- TabList.svelte -->
<div
  class={`tab-list`}
  {...$$restProps}
>
  <slot />
</div>

<style>
  .tab-list {
    border-bottom: var(--fds-border_width-default) solid
      var(--fds-semantic-border-neutral-subtle);
  }
</style>
